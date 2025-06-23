import React, { useRef, useEffect, useState, useCallback } from 'react';
import { DrawPoint } from '../types/game';

interface DrawingCanvasProps {
  canvas: DrawPoint[];
  isDrawer: boolean;
  isBlinded: boolean;
  onDraw: (data: DrawPoint) => void;
}

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  canvas,
  isDrawer,
  isBlinded,
  onDraw
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(null);

  const drawPoint = useCallback((ctx: CanvasRenderingContext2D, point: DrawPoint, prevPoint?: DrawPoint) => {
    if (point.type === 'start') {
      ctx.beginPath();
      ctx.moveTo(point.x, point.y);
    } else if (point.type === 'draw' && prevPoint) {
      ctx.strokeStyle = point.color || '#000000';
      ctx.lineWidth = point.size || 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
    }
  }, []);

  // Redraw canvas when canvas data changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Redraw all points
    for (let i = 0; i < canvas.length; i++) {
      const point = canvas[i];
      const prevPoint = i > 0 ? canvas[i - 1] : undefined;
      drawPoint(ctx, point, prevPoint);
    }
  }, [canvas, drawPoint]);

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawer) return;

    const pos = getMousePos(e);
    setIsDrawing(true);
    setLastPoint(pos);

    const drawPoint: DrawPoint = {
      x: pos.x,
      y: pos.y,
      type: 'start',
      color: '#000000',
      size: 3
    };

    onDraw(drawPoint);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawer || !isDrawing || !lastPoint) return;

    const pos = getMousePos(e);
    
    const drawPoint: DrawPoint = {
      x: pos.x,
      y: pos.y,
      type: 'draw',
      color: '#000000',
      size: 3
    };

    onDraw(drawPoint);
    setLastPoint(pos);
  };

  const handleMouseUp = () => {
    if (!isDrawer) return;
    
    setIsDrawing(false);
    setLastPoint(null);
    
    const drawPoint: DrawPoint = {
      x: 0,
      y: 0,
      type: 'end'
    };

    onDraw(drawPoint);
  };

  return (
    <div className="relative">
      <div className="bg-white border-4 border-gray-300 rounded-lg shadow-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className={`cursor-crosshair block ${
            isBlinded && isDrawer ? 'bg-black' : 'bg-white'
          }`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
        
        {/* Blinded overlay for drawer */}
        {isBlinded && isDrawer && (
          <div className="absolute inset-0 bg-black flex items-center justify-center">
            <div className="text-white text-center">
              <div className="text-2xl font-bold mb-2">👁️‍🗨️ MODALITÀ CIECA</div>
              <div className="text-lg">Disegna senza vedere!</div>
            </div>
          </div>
        )}
      </div>
      
      {/* Drawing Instructions */}
      <div className="mt-4 text-center text-gray-600">
        {isDrawer ? (
          <p className="font-semibold text-orange-500">
            {isBlinded ? 'Disegna la parola senza guardare!' : 'Disegna la parola!'}
          </p>
        ) : (
          <p>
            Guarda il disegno e indovina la parola nella chat!
          </p>
        )}
      </div>
    </div>
  );
};