import React from 'react';

const ChromaticDefense: React.FC = () => {
  return (
    <div className="w-full h-full min-h-96">
      <iframe
        src="/defesa-cromatica.html"
        className="w-full h-full border-0 rounded-lg"
        title="Defesa Cromática"
        style={{ minHeight: '600px' }}
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
};

export default ChromaticDefense;
