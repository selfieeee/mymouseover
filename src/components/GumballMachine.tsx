import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Gumball from './Gumball';
import Matter from 'matter-js';

// Стили для контейнера
const GumballMachineContainer = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  border: 2px solid #000;
  background-color: #f1f1f1;
`;

const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF', '#33FFF4','#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF', '#33FFF4','#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF', '#33FFF4',
  '#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF', '#33FFF4','#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF', '#33FFF4','#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF', '#33FFF4',
  '#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF', '#33FFF4','#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF', '#33FFF4','#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF', '#33FFF4'];

const GumballMachine: React.FC = () => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef(Matter.Engine.create());
  const worldRef = useRef(engineRef.current.world);

  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

  // Обновление размеров контейнера при изменении размеров окна
  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Создание и рендер контейнера
  useEffect(() => {
    if (!sceneRef.current) return;

    const { Engine, Render, World, Bodies } = Matter;
    const engine = engineRef.current;
    const world = worldRef.current;

    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: dimensions.width,
        height: dimensions.height,
        wireframes: false,
      },
    });

    // Создание границ контейнера
    const ground = Bodies.rectangle(dimensions.width / 2, dimensions.height, dimensions.width, 20, { isStatic: true });
    const leftWall = Bodies.rectangle(0, dimensions.height / 2, 20, dimensions.height, { isStatic: true });
    const rightWall = Bodies.rectangle(dimensions.width, dimensions.height / 2, 20, dimensions.height, { isStatic: true });
    const ceiling = Bodies.rectangle(dimensions.width / 2, 0, dimensions.width, 20, { isStatic: true });

    World.add(world, [ground, leftWall, rightWall, ceiling]);

    Engine.run(engine);
    Render.run(render);

    // Очищаем ресурсы при размонтировании компонента
    return () => {
      Render.stop(render);
      World.clear(world, false);
      Engine.clear(engine);
      render.canvas.remove();
      render.textures = {};
    };
  }, [dimensions]);

  return (
    <GumballMachineContainer ref={sceneRef}>
      {colors.map((color, index) => (
        <Gumball
          key={index}
          color={color}
          engine={engineRef.current}
          world={worldRef.current}
          containerWidth={dimensions.width}
          containerHeight={dimensions.height}
        />
      ))}
    </GumballMachineContainer>
  );
};

export default GumballMachine;
