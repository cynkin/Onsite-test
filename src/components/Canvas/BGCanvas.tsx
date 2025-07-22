'use client';

import { useEffect, useRef } from 'react';

const drops:Drop[] = [];
const particles:Particle[] = [];

class Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    alpha: number;
    color: string;
    ctx: CanvasRenderingContext2D;

    constructor(x: number, y: number, ctx: CanvasRenderingContext2D) {
        this.x = x;
        this.y = y;
        const angle = Math.random() * 2 * Math.PI;
        const speed = Math.random() * 5 + 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.alpha = 1;
        this.color = `hsl(${Math.random() * 360}, 100%, 60%)`;
        this.ctx = ctx;
    }

    update() {
        this.vx *= 0.98;
        this.vy *= 0.99;
        this.vy += 0.1;
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= 0.001;
        this.draw();
    }

    draw() {
        this.ctx.globalAlpha = this.alpha;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
        this.ctx.globalAlpha = 1;
    }
}

class Drop{
    x:number;
    y:number;
    radius:number;
    color:string;
    speed:number;
    c:CanvasRenderingContext2D;

    constructor(c:CanvasRenderingContext2D){
        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * window.innerHeight;
        this.color = "#00c950";
        this.c = c;
        this.radius = 10;
        this.speed = 3 + Math.random() * 2;
    }

    draw(){
        this.c.fillStyle = this.color;
        this.c.beginPath();
        this.c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.c.fill();
    }

    update(){
        if(this.y > window.innerHeight) {
            this.y = -this.radius;
        }
        this.y += this.speed;
        this.draw();
    }
}

export default function BackgroundCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const requestRef = useRef<number | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const generate = () =>{
            drops.length = 0;
            for(let i = 0; i < 100; i++){
                drops.push(new Drop(ctx));
            }
        }

        const animation = () => {
            requestRef.current = requestAnimationFrame(animation);
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            drops.forEach((drop) => drop.update());

            for (let i = particles.length - 1; i >= 0; i--) {
                particles[i].update();
                if (particles[i].alpha <= 0) {
                    particles.splice(i, 1);
                }
            }
        }

        const onClick = (e: MouseEvent) => {
            const x = e.clientX;
            const y = e.clientY;
            console.log(x, y);
            for(let i = 0; i < 50; i++){
                const particle = new Particle(x, y, ctx);
                particles.push(particle);
            }
        }

        window.addEventListener('click', onClick);

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            generate();
        };
        window.addEventListener('resize', handleResize)
        handleResize();

        animation();
        return () =>{
            if(requestRef.current) cancelAnimationFrame(requestRef.current);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('click', onClick);
        }
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 z-[-1] pointer-events-none "
        />
    );
}
