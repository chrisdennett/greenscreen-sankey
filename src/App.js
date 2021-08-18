import { useEffect, useState } from "react";
import { GreenScreen } from "./components/greenscreen/Greenscreen";

export default function App() {
  const [sourceImg, setSourceImg] = useState(null);

  useEffect(() => {
    const image = new Image();
    image.crossOrigin = "Anonymous";
    image.onload = () => setSourceImg(image);
    image.src = "./img/test-photo.jpg";
  }, []);

  return (
    <div>
      <GreenScreen bgImg={sourceImg} />
    </div>
  );
}
