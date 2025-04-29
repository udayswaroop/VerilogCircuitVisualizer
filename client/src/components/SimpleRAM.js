import React, { useEffect, useRef, useState } from 'react';
import $ from 'jquery'; // Required for digitaljs

// SimpleRAM component that accepts circuit configuration as props
const SimpleRAM = ({ initialCircuitConfig, title = "Simple RAM" }) => {
  console.log(initialCircuitConfig);
  const paperRef = useRef(null);
  const monitorRef = useRef(null);
  const iopanelRef = useRef(null);
  
  const [isFixed, setIsFixed] = useState(false);
  const [includeLayout, setIncludeLayout] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isLibraryLoaded, setIsLibraryLoaded] = useState(false);
  
  // References to store circuit objects
  const circuitRef = useRef(null);
  const monitorViewRef = useRef(null);
  const iopanelViewRef = useRef(null);
  const paperObjRef = useRef(null);
  const papersRef = useRef({});

  // Check if digitaljs is available
  useEffect(() => {
    const checkLibrary = () => {
      if (window.digitaljs) {
        setIsLibraryLoaded(true);
      } else {
        console.warn("digitaljs library not found. Make sure it's properly loaded.");
        // Try again in a second - in case the library is still loading
        setTimeout(checkLibrary, 1000);
      }
    };
    
    checkLibrary();
  }, []);

  useEffect(() => {
    // Initialize the circuit when component mounts or when circuitConfig changes
    // and only if digitaljs is loaded
    if (initialCircuitConfig && isLibraryLoaded) {
      loadCircuit(initialCircuitConfig);
    }

    // Cleanup when component unmounts
    return () => {
      cleanupCircuit();
    };
  }, [initialCircuitConfig, isLibraryLoaded]);

  const cleanupCircuit = () => {
    if (monitorViewRef.current) monitorViewRef.current.shutdown();
    if (iopanelViewRef.current) iopanelViewRef.current.shutdown();
    if (circuitRef.current) circuitRef.current.stop();
  };

  const setFixed = (fixed) => {
    Object.values(papersRef.current).forEach((p) => p.fixed(fixed));
  };

  const loadCircuit = (json) => {
    if (!window.digitaljs) {
      console.error("digitaljs library is not loaded");
      return;
    }

    // Clear previous circuit if exists
    cleanupCircuit();

    // Create new circuit
    const circuit = new window.digitaljs.Circuit(json);
    circuitRef.current = circuit;
    
    const monitor = new window.digitaljs.Monitor(circuit);
    const monitorview = new window.digitaljs.MonitorView({
      model: monitor,
      el: $(monitorRef.current),
    });
    monitorViewRef.current = monitorview;
    
    const iopanel = new window.digitaljs.IOPanelView({
      model: circuit,
      el: $(iopanelRef.current),
    });
    iopanelViewRef.current = iopanel;

    circuit.on("new:paper", function (paper) {
      paper.fixed(isFixed);
      papersRef.current[paper.cid] = paper;
      paper.on("element:pointerdblclick", (cellView) => {
        window.digitaljsCell = cellView.model;
        console.info(
          "You can now access the doubly clicked gate as digitaljsCell in your WebBrowser console!"
        );
      });
    });

    circuit.on("changeRunning", () => {
      setIsRunning(circuit.running);
    });

    const paper = circuit.displayOn($(paperRef.current));
    paperObjRef.current = paper;
    setFixed(isFixed);

    circuit.on("remove:paper", function (paper) {
      delete papersRef.current[paper.cid];
    });

    circuit.start();
    setIsRunning(true);
  };

  const handleStart = () => {
    if (circuitRef.current) circuitRef.current.start();
  };

  const handleStop = () => {
    if (circuitRef.current) circuitRef.current.stop();
  };

  const handleSerializeAndReload = () => {
    if (circuitRef.current) {
      const json = circuitRef.current.toJSON(includeLayout);
      console.log(json);
      loadCircuit(json);
    }
  };

  const handleFixedChange = (e) => {
    setIsFixed(e.target.checked);
    setFixed(e.target.checked);
  };

  const handleLayoutChange = (e) => {
    setIncludeLayout(e.target.checked);
  };

  const handlePptUp = () => {
    if (monitorViewRef.current) {
      monitorViewRef.current.pixelsPerTick *= 2;
    }
  };

  const handlePptDown = () => {
    if (monitorViewRef.current) {
      monitorViewRef.current.pixelsPerTick /= 2;
    }
  };

  const handleLeft = () => {
    if (monitorViewRef.current) {
      monitorViewRef.current.live = false;
      monitorViewRef.current.start -=
        monitorViewRef.current._width / monitorViewRef.current.pixelsPerTick / 4;
    }
  };

  const handleRight = () => {
    if (monitorViewRef.current) {
      monitorViewRef.current.live = false;
      monitorViewRef.current.start +=
        monitorViewRef.current._width / monitorViewRef.current.pixelsPerTick / 4;
    }
  };

  const handleLive = () => {
    if (monitorViewRef.current) {
      monitorViewRef.current.live = true;
    }
  };

  if (!isLibraryLoaded) {
    return <div>Loading digitaljs library...</div>;
  }

  return (
    <div className="simple-ram">
      <h2>{title}</h2>
      <div className="control-buttons">
        <button 
          name="start" 
          type="button" 
          onClick={handleStart}
          disabled={isRunning}
        >
          ▶️
        </button>
        <button 
          name="stop" 
          type="button" 
          onClick={handleStop}
          disabled={!isRunning}
        >
          ⏹️
        </button>
      </div>
      
      <div id="paper" ref={paperRef} className="circuit-paper"></div>
      
      <div className="settings">
        <input 
          name="fixed" 
          type="checkbox" 
          checked={isFixed}
          onChange={handleFixedChange}
        /> Fixed Mode
        
        <button
          name="json"
          type="button"
          onClick={handleSerializeAndReload}
        >
          Serialize and Reload
        </button>
        
        <input 
          name="layout" 
          type="checkbox" 
          checked={includeLayout}
          onChange={handleLayoutChange}
        /> Include layout information
      </div>
      
      <div className="monitor-controls">
        <button name="ppt_up" type="button" onClick={handlePptUp}>+</button>
        <button name="ppt_down" onClick={handlePptDown}>-</button>
        <button name="left" onClick={handleLeft}>&lt;</button>
        <button name="right" onClick={handleRight}>&gt;</button>
        <button name="live" onClick={handleLive}>live</button>
      </div>
      
      <div id="monitor" ref={monitorRef} className="circuit-monitor"></div>
      <div id="iopanel" ref={iopanelRef} className="circuit-iopanel"></div>
    </div>
  );
};

export default SimpleRAM;