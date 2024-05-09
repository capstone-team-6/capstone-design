# Lost Child Prevention Application

To prevent indoor incidents of lost children, continuously track the child's position and provide guidance.

## Feature

### WPS(WiFi Positioning System)

Determining position through the signal strength of access points requires a database of coordinate-signal strength pairs, known as a 'fingerprint.' We've streamlined the data collection process using QR codes.  
Currently, position inference is achieved using KNN. Enhancing accuracy and performance may be possible through the adoption of more precise methods.

### Indoor navigation

We guide the shortest path to the child, even if they are on another floor. We designate certain points, such as doors and stairs, as nodes. By connecting these nodes, we can then apply traditional algorithms to find the shortest path within the graph.
