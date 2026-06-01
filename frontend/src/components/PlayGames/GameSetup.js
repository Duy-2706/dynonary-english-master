import TopicSelect from './TopicSelect';
import React from 'react';

function GameSetup({ title, onStart }) {
  return <TopicSelect title={title} onStart={onStart} />;
}

export default GameSetup;