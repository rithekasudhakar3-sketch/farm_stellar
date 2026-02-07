from inference import get_model
import supervision as sv
import cv2


image_file = "cotton.jpg"
image = cv2.imread(image_file)


model = get_model(model_id="cotton-bolls-detection/9")


results = model.infer(image)[0]


detections = sv.Detections.from_inference(results)

has_cotton = len(detections) > 0
if has_cotton:
    class_names = detections.data['class_name']
    healthy_classes = ["Full opened", "full opened"]
    is_healthy = any(cls in healthy_classes for cls in class_names)
    
    print(f"Cotton detected: {has_cotton}")
    print(f"Cotton is healthy: {is_healthy}")
    print(f"Detected classes: {list(class_names)}")
else:
    print(f"Cotton detected: {has_cotton}")
    print("Cotton is healthy: False")