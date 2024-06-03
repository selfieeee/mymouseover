import React, { useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import Matter from 'matter-js';

interface GumballProps {
  color: string;
  engine: Matter.Engine;
  world: Matter.World;
  containerWidth: number;
  containerHeight: number;
}

// Стили для шарика
const GumballContainer = styled.div<{ color: string }>`
  position: absolute;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
`;

const Gumball: React.FC<GumballProps> = ({ color, engine, world, containerWidth, containerHeight }) => {
  const ref = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<Matter.Body | null>(null);

  // Создаем физическое тело для шарика и добавляем его в контейнер
  useEffect(() => {
    const { Bodies, World, Events } = Matter;

    const body = Bodies.circle(
      Math.random() * containerWidth,
      Math.random() * containerHeight,
      25,
      { restitution: 0.8 }
    );
    World.add(world, body);
    bodyRef.current = body;

    // Обновляем позицию DOM элемента в соответствии с физическим телом
    Events.on(engine, 'afterUpdate', () => {
      if (ref.current) {
        ref.current.style.transform = `translate(${body.position.x - 25}px, ${body.position.y - 25}px)`;
      }
    });

    // Удаляем тело из мира при размонтировании компонента
    return () => {
      World.remove(world, body);
    };
  }, [engine, world, containerWidth, containerHeight]);

  // Обработчик для сброса скорости шарика при отпускании мыши
  const handleMouseUp = useCallback(() => {
    if (bodyRef.current) {
      Matter.Body.setVelocity(bodyRef.current, { x: 0, y: 0 });
    }
  }, []);

  // Создаем и добавляем мышечное ограничение для перетаскивания шариков
  useEffect(() => {
    const { Mouse, MouseConstraint } = Matter;

    if (ref.current && ref.current.parentElement) {
      const mouse = Mouse.create(ref.current.parentElement);
      const mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
          stiffness: 0.2,
          render: {
            visible: false,
          },
        },
      });

      Matter.World.add(world, mouseConstraint);

      // Добавляем обработчик события mouseup
      mouseConstraint.mouse.element.addEventListener('mouseup', handleMouseUp);

      // Убираем обработчики при размонтировании компонента
      return () => {
        Matter.World.remove(world, mouseConstraint);
        mouseConstraint.mouse.element.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [engine, world, handleMouseUp]);

  // Проверка, чтобы шарики оставались в пределах коробки
  useEffect(() => {
    const checkBounds = () => {
      if (bodyRef.current) {
        const { position } = bodyRef.current;
        if (
          position.x < 0 ||
          position.x > containerWidth ||
          position.y < 0 ||
          position.y > containerHeight
        ) {
          Matter.Body.setPosition(bodyRef.current, {
            x: Math.max(25, Math.min(position.x, containerWidth - 25)),
            y: Math.max(25, Math.min(position.y, containerHeight - 25))
          });
          Matter.Body.setVelocity(bodyRef.current, { x: 0, y: 0 });
        }
      }
    };

    const intervalId = setInterval(checkBounds, 100);

    return () => clearInterval(intervalId);
  }, [containerWidth, containerHeight]);

  return <GumballContainer ref={ref} color={color} />;
};

export default Gumball;
