from typing import Dict, Any, List

class FailureCascadeEngine:
    def __init__(self):
        pass

    def analyze_cascade(self, primary_failure: str, telemetry_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generates a cascade graph JSON representing the chain of events.
        """
        nodes = []
        edges = []
        
        # Base failure node
        nodes.append({"id": "f1", "label": primary_failure, "type": "failure"})
        
        if primary_failure == "Thermal Overload":
            nodes.extend([
                {"id": "t1", "label": "Ambient Temp Rise", "type": "telemetry"},
                {"id": "c1", "label": "CPU Throttling", "type": "consequence"},
                {"id": "c2", "label": "Unexpected Shutdown", "type": "risk"}
            ])
            edges.extend([
                {"source": "t1", "target": "f1"},
                {"source": "f1", "target": "c1"},
                {"source": "c1", "target": "c2"}
            ])
        elif primary_failure == "Fan Failure":
            nodes.extend([
                {"id": "t1", "label": "Fan RPM Drop", "type": "telemetry"},
                {"id": "c1", "label": "Thermal Overload", "type": "failure"},
                {"id": "c2", "label": "Component Degradation", "type": "risk"}
            ])
            edges.extend([
                {"source": "t1", "target": "f1"},
                {"source": "f1", "target": "c1"},
                {"source": "c1", "target": "c2"}
            ])
        elif primary_failure == "SSD Degradation":
            nodes.extend([
                {"id": "t1", "label": "Reallocated Sectors Increase", "type": "telemetry"},
                {"id": "c1", "label": "I/O Wait Times Spike", "type": "consequence"},
                {"id": "c2", "label": "Data Corruption Risk", "type": "risk"}
            ])
            edges.extend([
                {"source": "t1", "target": "f1"},
                {"source": "f1", "target": "c1"},
                {"source": "c1", "target": "c2"}
            ])
        else:
            # Generic cascade
            nodes.extend([
                {"id": "c1", "label": "System Instability", "type": "risk"}
            ])
            edges.extend([
                {"source": "f1", "target": "c1"}
            ])
            
        return {
            "nodes": nodes,
            "edges": edges
        }
