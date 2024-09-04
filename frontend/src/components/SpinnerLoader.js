'use client';
import { Spinner } from '@chakra-ui/react';
import React from 'react';

function SpinnerLoader({ ...rest }) {
  return <Spinner {...rest} color='#3C3D37' />;
}

export default SpinnerLoader;
