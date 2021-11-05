import React from 'react';
import { User } from './Types';

const UserContext = React.createContext({
  userName: '',
  userId: ''
} as User);

export default UserContext;