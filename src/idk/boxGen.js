import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Box, Html } from '@react-three/drei';

function BoxGen() {
  const [boxes, setBoxes] = useState([]);

  const addBox = () => {
    // Add a new box with unique id to the array
    setBoxes([...boxes, { id: boxes.length }]);
  };

  return (
    <>
      <Html position={[-2, 2, 0]} center>
        <button onClick={addBox} style={{ fontSize: '16px', padding: '8px 16px' }}>Add Box</button>
      </Html>
      
        {boxes.map((box) => (
          <Box key={box.id} position={[Math.random() * 5, Math.random() * 5, Math.random() * 5]}>
            <meshStandardMaterial attach="material" color="orange" />
          </Box>
        ))}
      
    </>
  );
}

export default BoxGen;
