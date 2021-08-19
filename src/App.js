import { useEffect, useState } from "react";
import Controls from "./components/controls/Controls";
import { GreenScreen } from "./components/greenscreen/Greenscreen";
import { useKeyPress } from "./hooks/useKeyPress";
import styles from "./app.module.css";

export default function App() {
  const [sourceImg, setSourceImg] = useState(null);
  const [showControls, setShowControls] = useState(true);
  const [colourMode, setColourMode] = useState("b&w");
  const [visibleElements, setVisibleElements] = useState({
    webcam: false,
    greenscreen: false,
    output: true,
  });
  const [cropBox, setCropBox] = useState({
    top: 0.15,
    bottom: 0,
    left: 0.2,
    right: 0.26,
  });
  const [outBox, setOutBox] = useState({ top: 0.6, left: 0.3, height: 0.2 });
  const [colourToRemove, setColourToRemove] = useState({
    r: 24,
    g: 218,
    b: 175,
  });
  const [tolerance, setTolerance] = useState(100);
  const [brightnessAdjust, setBrightnessAdjust] = useState(-38);

  useKeyPress(" ", () => setShowControls((prev) => !prev));

  useEffect(() => {
    const image = new Image();
    image.crossOrigin = "Anonymous";
    image.onload = () => setSourceImg(image);
    image.src = "./img/test-photo-large.jpg";
  }, []);

  const onToleranceChange = (e) => setTolerance(parseInt(e.target.value));
  const onOutBoxChange = (prop, value) =>
    setOutBox({ ...outBox, [prop]: value });
  const onCropBoxChange = (prop, value) =>
    setCropBox({ ...cropBox, [prop]: value });
  const onVisibleElementsChange = (prop, value) =>
    setVisibleElements({ ...visibleElements, [prop]: value });

  const greenScreenProps = {
    bgImg: sourceImg,
    colourToRemove,
    tolerance,
    cropBox,
    outBox,
    visibleElements,
    setColourToRemove,
    colourMode,
    brightnessAdjust,
  };

  const controlsProps = {
    cropBox,
    outBox,
    tolerance,
    colourToRemove,
    onCropBoxChange,
    onToleranceChange,
    onOutBoxChange,
    visibleElements,
    onVisibleElementsChange,
    colourMode,
    setColourMode,
    brightnessAdjust,
    setBrightnessAdjust,
  };

  return (
    <div className={styles.app}>
      {showControls && <Controls {...controlsProps} />}
      <div style={{ marginLeft: showControls ? 270 : 0 }}>
        <GreenScreen {...greenScreenProps} />
      </div>
    </div>
  );
}
