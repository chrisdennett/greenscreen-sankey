import React from "react";
import styles from "./controls.module.css";

const colourModeOptions = ["b&w", "b&w2", "colour", "sepia"];

export default function Controls({
  colourToRemove,
  tolerance,
  cropBox,
  outBox,
  onToleranceChange,
  onCropBoxChange,
  onOutBoxChange,
  visibleElements,
  onVisibleElementsChange,
  colourMode,
  setColourMode,
  brightnessAdjust,
  setBrightnessAdjust,
}) {
  return (
    <div className={styles.controls}>
      <span className={styles.controlName}>SHOW/HIDE CONTROLS = Spacebar</span>
      <section>
        <h2 className={styles.sectionHeader}>View</h2>
        <label>
          <span className={styles.controlName}>WEBCAM:</span>
          <input
            type="checkbox"
            checked={visibleElements.webcam}
            onChange={(e) =>
              onVisibleElementsChange("webcam", e.target.checked)
            }
          />
        </label>

        <label>
          <span className={styles.controlName}>GREENSCREEN:</span>
          <input
            type="checkbox"
            checked={visibleElements.greenscreen}
            onChange={(e) =>
              onVisibleElementsChange("greenscreen", e.target.checked)
            }
          />
        </label>
        <label>
          <span className={styles.controlName}>OUTPUT:</span>
          <input
            type="checkbox"
            checked={visibleElements.output}
            onChange={(e) =>
              onVisibleElementsChange("output", e.target.checked)
            }
          />
        </label>
      </section>
      <section>
        <h2 className={styles.sectionHeader}>Greenscreen settings</h2>

        <span className={styles.controlName}>Colour to remove:</span>
        <div
          className={styles.colourSwatch}
          style={{
            backgroundColor: `rgb(${colourToRemove.r}, ${colourToRemove.g}, ${colourToRemove.b})`,
          }}
        >
          {`r:${colourToRemove.r}, g:${colourToRemove.g}, b:${colourToRemove.b}`}
        </div>
        <label>
          <span className={styles.controlName}>tolerance: </span>
          <input
            type="range"
            value={tolerance}
            onChange={onToleranceChange}
            min="0"
            max="255"
          />
          {tolerance}
        </label>
        <label>
          <span className={styles.controlName}>crop left: </span>
          <input
            type="range"
            value={cropBox.left}
            onChange={(e) => onCropBoxChange("left", e.target.value)}
            min="0"
            max="1"
            step="0.01"
          />
          {cropBox.left}
        </label>
        <label>
          <span className={styles.controlName}>crop right: </span>
          <input
            type="range"
            value={cropBox.right}
            onChange={(e) => onCropBoxChange("right", e.target.value)}
            min="0"
            max="1"
            step="0.01"
          />
          {cropBox.right}
        </label>
        <label>
          <span className={styles.controlName}>crop top: </span>
          <input
            type="range"
            value={cropBox.top}
            onChange={(e) => onCropBoxChange("top", e.target.value)}
            min="0"
            max="1"
            step="0.01"
          />
          {cropBox.top}
        </label>
        <label>
          <span className={styles.controlName}>crop bottom: </span>
          <input
            type="range"
            value={cropBox.bottom}
            onChange={(e) => onCropBoxChange("bottom", e.target.value)}
            min="0"
            max="1"
            step="0.01"
          />
          {cropBox.bottom}
        </label>
      </section>

      <section>
        <h2 className={styles.sectionHeader}>Colour Adjust</h2>
        <select
          value={colourMode}
          onChange={(e) => setColourMode(e.target.value)}
        >
          {colourModeOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>

        <label>
          <span className={styles.controlName}>brightnessAdjust: </span>
          <input
            type="range"
            value={brightnessAdjust}
            onChange={(e) => setBrightnessAdjust(parseInt(e.target.value))}
            min="-100"
            max="100"
            step="1"
          />
          {brightnessAdjust}
        </label>
      </section>

      <section>
        <h2 className={styles.sectionHeader}>Combined Photo settings</h2>
        <label>
          <span className={styles.controlName}>left: </span>
          <input
            type="range"
            value={outBox.left}
            onChange={(e) => onOutBoxChange("left", e.target.value)}
            min="0"
            max="1"
            step="0.01"
          />
          {outBox.left}
        </label>
        <label>
          <span className={styles.controlName}>top: </span>
          <input
            type="range"
            value={outBox.top}
            onChange={(e) => onOutBoxChange("top", e.target.value)}
            min="0"
            max="1"
            step="0.01"
          />
          {outBox.top}
        </label>
        <label>
          <span className={styles.controlName}>height: </span>
          <input
            type="range"
            value={outBox.height}
            onChange={(e) => onOutBoxChange("height", e.target.value)}
            min="0"
            max="1"
            step="0.01"
          />
          {outBox.height}
        </label>
      </section>
    </div>
  );
}
