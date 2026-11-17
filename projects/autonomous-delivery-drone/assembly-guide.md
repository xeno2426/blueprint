# Autonomous Delivery Drone - Hardware Manual

**Category:** Robotics | **Difficulty:** Advanced | **Author:** Antigravity Engineer  
**Total BOM Cost:** $89.65 | **Estimated Build Time:** 4-6 hours

---

## 1. System Specifications
- **Core Microcontroller:** STM32F405 Flight Controller
- **Power Budget:** 14.8V 4S 1500mAh LiPo Battery
- **Dimensions:** 120 x 80 x 35 mm
- **Weight:** 220 g

---

## 2. Bill of Materials (5 Components)
| Component | SKU / Vendor | Qty | Unit Price |
| :--- | :--- | :--- | :--- |
| STM32F405 Flight Controller | STM32F405-FC-V3-ND (DigiKey) | 1 | $32.00 |
| 14.8V 4S 1500mAh LiPo Battery | AF-BAT-2500 (Adafruit) | 1 | $14.50 |
| Multisensor Breakout (I2C / SPI) | SEN-19096 (SparkFun) | 1 | $19.95 |
| OLED / E-Ink Visual Display | WS-154-SPI (Waveshare) | 1 | $11.20 |
| Parametric Protective Enclosure | CAD-GEN-ENCL-01 (Custom 3D Print / ForgeCAD) | 1 | $12.00 |

---

## 3. Assembly Instructions
### Step 1: Print 3D Enclosure & Prepare Fasteners
*Time: undefined*
3D print the top and bottom shell using PETG filament. Clean out heat-set insert pockets.

**Tools Required:** 3D Printer, Soldering Iron for Inserts, M2.5 Hardware

### Step 2: Circuit Soldering & Wire Routing
*Time: undefined*
Connect the sensor, microcontroller, and power regulation module using 28 AWG silicone wire.

**Tools Required:** Soldering Iron, Wire Strippers, Flux & Solder

### Step 3: Final Assembly & Firmware Flashing
*Time: undefined*
Mount the PCB into the enclosure, fasten the lid with M2.5 hex bolts, and upload initial firmware.

**Tools Required:** M2.5 Hex Driver, USB-C Cable

