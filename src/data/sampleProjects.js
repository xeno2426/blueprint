export const SAMPLE_PROJECTS = [
  {
    id: "proj-quadruped-dog",
    projectName: "Autonomous Quadruped Robot Dog",
    description: "12-DOF agile quadruped robot with inverse kinematics, ultrasonic obstacle avoidance, and wireless remote control.",
    category: "Robotics",
    stars: 1420,
    author: "Alex Rivera",
    authorAvatar: "AR",
    created_at: "2026-10-14T10:00:00Z",
    thumbnail: "/landing/images/hero-dog.webp",
    renderImage: "/landing/images/hero-dog.webp",
    estimatedCost: 148.50,
    buildTime: "6-8 hours",
    difficulty: "Advanced",
    specs: {
      mcu: "ESP32-S3 Dual-Core 240MHz",
      power: "7.4V 2S LiPo 2200mAh",
      dof: "12 Degrees of Freedom (3 per leg)",
      sensors: "HC-SR04 Ultrasonic, MPU6050 6-Axis IMU",
      weight: "1.15 kg",
      dimensions: "260 x 180 x 140 mm"
    },
    nodes: [
      {
        id: "node-esp32",
        name: "ESP32-S3 Development Board",
        productName: "ESP32-S3-DevKitC-1 N8R8",
        category: "electrical",
        type: "microcontroller",
        vendor: "DigiKey",
        vendor_sku: "1965-ESP32-S3-DEVKITC-1-N8R8-ND",
        price: 9.80,
        quantity: 1,
        inStock: true,
        stockCount: 1420,
        pins: [
          { name: "3V3", type: "power", signal: "3.3V" },
          { name: "GND", type: "ground", signal: "GND" },
          { name: "GPIO1", type: "i2c", signal: "SDA" },
          { name: "GPIO2", type: "i2c", signal: "SCL" },
          { name: "GPIO4", type: "gpio", signal: "TRIG" },
          { name: "GPIO5", type: "gpio", signal: "ECHO" },
          { name: "GPIO18", type: "uart", signal: "TX" },
          { name: "GPIO19", type: "uart", signal: "RX" }
        ],
        dimensions: { width: 55, height: 28, depth: 8 },
        purchaseUrl: "https://www.digikey.com"
      },
      {
        id: "node-pca9685",
        name: "16-Channel 12-Bit PWM Driver",
        productName: "PCA9685 I2C Servo Controller",
        category: "electrical",
        type: "driver",
        vendor: "Adafruit",
        vendor_sku: "AF-815",
        price: 14.95,
        quantity: 1,
        inStock: true,
        stockCount: 380,
        pins: [
          { name: "VCC", type: "power", signal: "3.3V" },
          { name: "V+", type: "power", signal: "5.0V Servo" },
          { name: "GND", type: "ground", signal: "GND" },
          { name: "SDA", type: "i2c", signal: "SDA" },
          { name: "SCL", type: "i2c", signal: "SCL" },
          { name: "PWM0-11", type: "pwm", signal: "12x Servo Signals" }
        ],
        dimensions: { width: 62, height: 25, depth: 10 },
        purchaseUrl: "https://www.adafruit.com"
      },
      {
        id: "node-servos",
        name: "High-Torque Metal Gear Servos (12x)",
        productName: "MG996R Digital 11kg/cm Servo",
        category: "mechanical",
        type: "actuator",
        vendor: "AliExpress",
        vendor_sku: "MG996R-12PK",
        price: 54.00,
        quantity: 12,
        inStock: true,
        stockCount: 5000,
        pins: [
          { name: "SIG", type: "pwm", signal: "PWM" },
          { name: "V+", type: "power", signal: "5V-6V" },
          { name: "GND", type: "ground", signal: "GND" }
        ],
        dimensions: { width: 40.7, height: 19.7, depth: 42.9 },
        purchaseUrl: "https://www.aliexpress.com"
      },
      {
        id: "node-buck",
        name: "DC-DC Step-Down Buck Converter",
        productName: "LM2596S High-Current 5V 5A Regulator",
        category: "electrical",
        type: "power",
        vendor: "Mouser",
        vendor_sku: "511-LM2596S-5.0",
        price: 6.50,
        quantity: 1,
        inStock: true,
        stockCount: 890,
        pins: [
          { name: "IN+", type: "power", signal: "7.4V Bat" },
          { name: "IN-", type: "ground", signal: "GND" },
          { name: "OUT+", type: "power", signal: "5.0V Reg" },
          { name: "OUT-", type: "ground", signal: "GND" }
        ],
        dimensions: { width: 43, height: 21, depth: 14 },
        purchaseUrl: "https://www.mouser.com"
      },
      {
        id: "node-battery",
        name: "2S LiPo Battery 7.4V 2200mAh",
        productName: "Zeee 2S 50C HardCase LiPo with XT60",
        category: "electrical",
        type: "battery",
        vendor: "Amazon",
        vendor_sku: "B07QNJ3LPL",
        price: 18.99,
        quantity: 1,
        inStock: true,
        stockCount: 210,
        pins: [
          { name: "XT60+", type: "power", signal: "7.4V" },
          { name: "XT60-", type: "ground", signal: "GND" }
        ],
        dimensions: { width: 138, height: 46, depth: 25 },
        purchaseUrl: "https://www.amazon.com"
      },
      {
        id: "node-chassis",
        name: "3D Printed Robotic Chassis & Legs",
        productName: "Custom PETG Carbon-Infused Frame",
        category: "3d_printed",
        type: "enclosure",
        vendor: "Custom 3D Print",
        vendor_sku: "STL-DOG-PETG-V2",
        price: 16.00,
        quantity: 1,
        material: "PETG / Carbon Fiber",
        printSettings: { layerHeight: 0.2, infill: 35, support: true },
        inStock: true,
        stockCount: 999,
        dimensions: { width: 240, height: 160, depth: 120 }
      },
      {
        id: "node-imu",
        name: "6-Axis Gyroscope & Accelerometer",
        productName: "MPU-6050 Motion Sensor Breakout",
        category: "electrical",
        type: "sensor",
        vendor: "SparkFun",
        vendor_sku: "SEN-11028",
        price: 7.50,
        quantity: 1,
        inStock: true,
        stockCount: 640,
        pins: [
          { name: "VCC", type: "power", signal: "3.3V" },
          { name: "GND", type: "ground", signal: "GND" },
          { name: "SCL", type: "i2c", signal: "SCL" },
          { name: "SDA", type: "i2c", signal: "SDA" }
        ],
        dimensions: { width: 20, height: 16, depth: 3 },
        purchaseUrl: "https://www.sparkfun.com"
      },
      {
        id: "node-sonar",
        name: "Ultrasonic Distance Sensor",
        productName: "HC-SR04 Range Finder",
        category: "electrical",
        type: "sensor",
        vendor: "Adafruit",
        vendor_sku: "AF-3942",
        price: 3.95,
        quantity: 1,
        inStock: true,
        stockCount: 1200,
        pins: [
          { name: "VCC", type: "power", signal: "5V" },
          { name: "GND", type: "ground", signal: "GND" },
          { name: "TRIG", type: "gpio", signal: "TRIG" },
          { name: "ECHO", type: "gpio", signal: "ECHO" }
        ],
        dimensions: { width: 45, height: 20, depth: 15 },
        purchaseUrl: "https://www.adafruit.com"
      }
    ],
    electricalConnections: [
      { id: "w1", fromNode: "node-battery", fromPin: "XT60+", toNode: "node-buck", toPin: "IN+", color: "#ef4444", label: "7.4V Raw" },
      { id: "w2", fromNode: "node-battery", fromPin: "XT60-", toNode: "node-buck", toPin: "IN-", color: "#1f2937", label: "GND" },
      { id: "w3", fromNode: "node-buck", fromPin: "OUT+", toNode: "node-pca9685", toPin: "V+", color: "#f97316", label: "5V High-Current" },
      { id: "w4", fromNode: "node-buck", fromPin: "OUT+", toNode: "node-esp32", toPin: "3V3", color: "#f59e0b", label: "5V USB/Vin" },
      { id: "w5", fromNode: "node-buck", fromPin: "OUT-", toNode: "node-esp32", toPin: "GND", color: "#1f2937", label: "Common GND" },
      { id: "w6", fromNode: "node-buck", fromPin: "OUT-", toNode: "node-pca9685", toPin: "GND", color: "#1f2937", label: "Common GND" },
      { id: "w7", fromNode: "node-esp32", fromPin: "GPIO1", toNode: "node-pca9685", toPin: "SDA", color: "#3b82f6", label: "I2C SDA" },
      { id: "w8", fromNode: "node-esp32", fromPin: "GPIO2", toNode: "node-pca9685", toPin: "SCL", color: "#10b981", label: "I2C SCL" },
      { id: "w9", fromNode: "node-esp32", fromPin: "GPIO1", toNode: "node-imu", toPin: "SDA", color: "#3b82f6", label: "I2C SDA" },
      { id: "w10", fromNode: "node-esp32", fromPin: "GPIO2", toNode: "node-imu", toPin: "SCL", color: "#10b981", label: "I2C SCL" },
      { id: "w11", fromNode: "node-esp32", fromPin: "GPIO4", toNode: "node-sonar", toPin: "TRIG", color: "#a855f7", label: "Sonar Trigger" },
      { id: "w12", fromNode: "node-esp32", fromPin: "GPIO5", toNode: "node-sonar", toPin: "ECHO", color: "#ec4899", label: "Sonar Echo" },
      { id: "w13", fromNode: "node-pca9685", fromPin: "PWM0-11", toNode: "node-servos", toPin: "SIG", color: "#eab308", label: "12x PWM Channels" }
    ],
    mechanicalConnections: [
      { parentNode: "node-chassis", childNode: "node-esp32", type: "M2.5 Standoffs", count: 4 },
      { parentNode: "node-chassis", childNode: "node-pca9685", type: "M3 Screws", count: 4 },
      { parentNode: "node-chassis", childNode: "node-servos", type: "Shoulder Screws & Bearings", count: 24 },
      { parentNode: "node-chassis", childNode: "node-battery", type: "Velcro Strap & Tray", count: 1 },
      { parentNode: "node-chassis", childNode: "node-sonar", type: "Press-fit Front Bezel", count: 1 }
    ],
    instructions: [
      {
        step: 1,
        title: "Print & Prepare Mechanical Chassis",
        description: "Print the chassis body, upper legs, and lower shin brackets using PETG or carbon-fiber composite filament with 35% infill and 4 perimeter walls for structural rigidity.",
        tools: ["3D Printer", "Deburring Tool", "M3 Tap"],
        subSteps: [
          "Clean all support material from servo pockets and bearing seats.",
          "Thread all 16 M3 screw holes using a hand tap to ensure smooth mechanical alignment.",
          "Press-fit the 8mm ball bearings into the leg pivot joints."
        ]
      },
      {
        step: 2,
        title: "Install 12x MG996R Servos into Shoulder & Knee Joints",
        description: "Zero all 12 servo horns before mounting them to prevent mechanical binding when first powered on.",
        tools: ["#1 Phillips Screwdriver", "Servo Tester / Microcontroller", "M3 Hardware"],
        subSteps: [
          "Connect each servo to a servo tester or ESP32 test code to center horns at exactly 90 degrees.",
          "Fasten 4 shoulder servos into the central chassis using M3x8mm socket head screws.",
          "Assemble 4 upper leg linkages with the knee servos and attach metal servo horns."
        ]
      },
      {
        step: 3,
        title: "Power Distribution & Wiring Harness",
        description: "Wire the high-current power distribution rail from the 2S LiPo battery through the buck converter to the PCA9685 servo driver.",
        tools: ["Soldering Iron", "Heat Gun", "Wire Strippers", "XT60 Connector"],
        subSteps: [
          "Solder XT60 pigtail to the input terminals of the LM2596 buck converter.",
          "Tune buck converter potentiometer with a multimeter to verify an exact 5.2V output under load.",
          "Connect buck output to PCA9685 power screw terminals (V+ and GND)."
        ]
      },
      {
        step: 4,
        title: "Mount & Interconnect Microcontroller & Sensors",
        description: "Mount the ESP32-S3 and MPU6050 IMU on anti-vibration standoffs and wire the shared I2C bus.",
        tools: ["M2.5 Screwdriver", "Silicone Dampers", "Jumper Wires"],
        subSteps: [
          "Mount the MPU6050 IMU close to the physical center of mass of the chassis.",
          "Run 4-pin I2C harness (3V3, GND, SDA, SCL) from ESP32 to both PCA9685 and MPU6050 in parallel.",
          "Connect HC-SR04 sonar module to ESP32 GPIO4 (Trig) and GPIO5 (Echo)."
        ]
      },
      {
        step: 5,
        title: "Firmware Flash, Kinematics Calibration & First Walk",
        description: "Upload the inverse-kinematics gait engine to the ESP32-S3 and perform initial stand and trot calibration.",
        tools: ["USB-C Data Cable", "PlatformIO / Arduino IDE", "Benchtop Power Supply"],
        subSteps: [
          "Place the dog on an elevated stand so legs hang freely.",
          "Flash the firmware via USB-C and open the serial monitor at 115200 baud.",
          "Verify IMU pitch/roll telemetry and trigger stand-up pose.",
          "Test creep gait on flat surface and tune ground contact PID offsets."
        ]
      }
    ]
  },
  {
    id: "proj-cyberdeck",
    projectName: "Cyberpunk Cyberdeck Wrist Terminal",
    description: "Wearable tactical terminal featuring Raspberry Pi CM4, 4.3-inch round sunlight-readable DSI display, and LoRa mesh transceiver.",
    category: "Wearables",
    stars: 980,
    author: "Kira Thorne",
    authorAvatar: "KT",
    created_at: "2026-10-28T14:30:00Z",
    thumbnail: "/landing/images/hero-dog.webp",
    renderImage: "/landing/images/hero-dog.webp",
    estimatedCost: 185.00,
    buildTime: "4-5 hours",
    difficulty: "Intermediate",
    specs: {
      mcu: "Raspberry Pi CM4 (4GB RAM, WiFi/BT)",
      power: "3.7V 3500mAh 18650 Li-Ion Cell",
      display: "4.3\" Round 800x800 DSI IPS Touchscreen",
      wireless: "SX1262 LoRa 915MHz Meshtastic",
      weight: "340 g",
      dimensions: "130 x 95 x 32 mm"
    },
    nodes: [
      {
        id: "node-cm4",
        name: "Raspberry Pi Compute Module 4",
        productName: "CM4104032 (4GB RAM, 32GB eMMC, WiFi)",
        category: "electrical",
        type: "microcontroller",
        vendor: "Mouser",
        vendor_sku: "847-CM4104032",
        price: 65.00,
        quantity: 1,
        inStock: true,
        stockCount: 140,
        dimensions: { width: 55, height: 40, depth: 4.7 }
      },
      {
        id: "node-round-screen",
        name: "4.3-inch Round DSI IPS Touchscreen",
        productName: "800x800 Capacitive Touch Display",
        category: "electrical",
        type: "display",
        vendor: "Waveshare",
        vendor_sku: "WS-21345",
        price: 49.99,
        quantity: 1,
        inStock: true,
        stockCount: 88,
        dimensions: { width: 110, height: 110, depth: 8 }
      },
      {
        id: "node-lora",
        name: "SX1262 LoRa Transceiver 915MHz",
        productName: "Waveshare SX1262 LoRa HAT Module",
        category: "electrical",
        type: "wireless",
        vendor: "DigiKey",
        vendor_sku: "2201-SX1262-ND",
        price: 19.50,
        quantity: 1,
        inStock: true,
        stockCount: 410,
        dimensions: { width: 45, height: 25, depth: 6 }
      },
      {
        id: "node-enclosure-al",
        name: "CNC Anodized Aluminum Wrist Enclosure",
        productName: "Machined 6061-T6 Aluminum Case with NATO Strap Mounts",
        category: "mechanical",
        type: "enclosure",
        vendor: "Custom CNC",
        vendor_sku: "CNC-CYBER-WRIST-V1",
        price: 42.00,
        quantity: 1,
        inStock: true,
        stockCount: 200,
        dimensions: { width: 135, height: 100, depth: 34 }
      }
    ],
    electricalConnections: [
      { id: "c1", fromNode: "node-cm4", fromPin: "DSI", toNode: "node-round-screen", toPin: "DSI_IN", color: "#3b82f6", label: "DSI Video" },
      { id: "c2", fromNode: "node-cm4", fromPin: "SPI0", toNode: "node-lora", toPin: "SPI_IN", color: "#10b981", label: "SPI LoRa Bus" }
    ],
    mechanicalConnections: [
      { parentNode: "node-enclosure-al", childNode: "node-round-screen", type: "O-Ring Sealed Bezel", count: 1 }
    ],
    instructions: [
      {
        step: 1,
        title: "Screen Installation & Gasket Sealing",
        description: "Seat the rubber O-ring gasket into the front CNC aluminum bezel to provide IP65 water resistance.",
        tools: ["Precision Tweezers", "Silicone Grease"],
        subSteps: ["Apply thin film of silicone grease to O-ring channel.", "Press round IPS glass flush into bezel."]
      }
    ]
  },
  {
    id: "proj-greenhouse",
    projectName: "Automated Aeroponics Plant Incubator",
    description: "High-pressure aeroponics controller with automated nutrient dosing, ultrasonic misting, and environmental monitoring.",
    category: "Automation",
    stars: 760,
    author: "Elena Rostova",
    authorAvatar: "ER",
    created_at: "2026-11-02T08:15:00Z",
    thumbnail: "/landing/images/hero-dog.webp",
    renderImage: "/landing/images/hero-dog.webp",
    estimatedCost: 112.00,
    buildTime: "3-4 hours",
    difficulty: "Beginner",
    specs: {
      mcu: "Raspberry Pi Pico W",
      power: "12V 5A DC Adapter",
      sensors: "BME280, pH Probe, EC Sensor, Float Switch",
      actuators: "100 PSI Diaphragm Pump, Misting Nozzles, Relay Bank",
      weight: "2.4 kg",
      dimensions: "350 x 250 x 200 mm"
    },
    nodes: [
      {
        id: "node-pico-w",
        name: "Raspberry Pi Pico W",
        productName: "RP2040 Microcontroller with 2.4GHz WiFi",
        category: "electrical",
        type: "microcontroller",
        vendor: "DigiKey",
        vendor_sku: "2648-SC0918-ND",
        price: 6.00,
        quantity: 1,
        inStock: true,
        stockCount: 8900,
        dimensions: { width: 51, height: 21, depth: 4 }
      },
      {
        id: "node-pump",
        name: "100 PSI High-Pressure Diaphragm Pump",
        productName: "12V DC 5L/min Self-Priming Booster Pump",
        category: "mechanical",
        type: "pump",
        vendor: "Amazon",
        vendor_sku: "PUMP-100PSI-12V",
        price: 24.50,
        quantity: 1,
        inStock: true,
        stockCount: 450,
        dimensions: { width: 165, height: 100, depth: 62 }
      },
      {
        id: "node-relays",
        name: "4-Channel 10A Optocoupler Relay Module",
        productName: "Songle 5V Relay Board with Optical Isolation",
        category: "electrical",
        type: "relay",
        vendor: "SparkFun",
        vendor_sku: "COM-13815",
        price: 8.95,
        quantity: 1,
        inStock: true,
        stockCount: 1540,
        dimensions: { width: 75, height: 55, depth: 18 }
      }
    ],
    electricalConnections: [
      { id: "g1", fromNode: "node-pico-w", fromPin: "GP14", toNode: "node-relays", toPin: "IN1", color: "#10b981", label: "Pump Control" }
    ],
    mechanicalConnections: [],
    instructions: []
  },
  {
    "id": "proj-autonomous-delivery-drone-e9wo",
    "projectName": "Autonomous Delivery Drone",
    "description": "Heavy-lift delivery quadcopter with GPS telemetry, collision avoidance lidar, and automated payload drop mechanism.",
    "category": "Robotics",
    "stars": 1,
    "author": "Antigravity Engineer",
    "authorAvatar": "AN",
    "created_at": "2026-11-17T07:55:49.032Z",
    "thumbnail": "/landing/images/hero-dog.webp",
    "renderImage": "/landing/images/hero-dog.webp",
    "estimatedCost": 89.65,
    "buildTime": "4-6 hours",
    "difficulty": "Advanced",
    "specs": {
      "mcu": "STM32F405 Flight Controller",
      "power": "14.8V 4S 1500mAh LiPo Battery",
      "connectivity": "WiFi 802.11 b/g/n, BLE 5.0",
      "sensors": "Environmental Telemetry, High-Accuracy ADC",
      "weight": "220 g",
      "dimensions": "120 x 80 x 35 mm"
    },
    "nodes": [
      {
        "id": "node-core-mcu",
        "name": "STM32F405 Flight Controller",
        "productName": "STM32F405-FC-V3",
        "category": "electrical",
        "type": "microcontroller",
        "vendor": "DigiKey",
        "vendor_sku": "STM32F405-FC-V3-ND",
        "price": 32,
        "quantity": 1,
        "inStock": true,
        "stockCount": 1850,
        "pins": [
          {
            "name": "3V3",
            "type": "power",
            "signal": "3.3V"
          },
          {
            "name": "GND",
            "type": "ground",
            "signal": "GND"
          },
          {
            "name": "SDA",
            "type": "i2c",
            "signal": "SDA"
          },
          {
            "name": "SCL",
            "type": "i2c",
            "signal": "SCL"
          },
          {
            "name": "GPIO4",
            "type": "gpio",
            "signal": "D4"
          },
          {
            "name": "GPIO5",
            "type": "gpio",
            "signal": "D5"
          },
          {
            "name": "TX",
            "type": "uart",
            "signal": "UART_TX"
          },
          {
            "name": "RX",
            "type": "uart",
            "signal": "UART_RX"
          }
        ],
        "dimensions": {
          "width": 50,
          "height": 25,
          "depth": 6
        },
        "purchaseUrl": "https://www.digikey.com"
      },
      {
        "id": "node-power-unit",
        "name": "14.8V 4S 1500mAh LiPo Battery",
        "productName": "High-Density Energy Storage Unit",
        "category": "electrical",
        "type": "battery",
        "vendor": "Adafruit",
        "vendor_sku": "AF-BAT-2500",
        "price": 14.5,
        "quantity": 1,
        "inStock": true,
        "stockCount": 420,
        "pins": [
          {
            "name": "V+",
            "type": "power",
            "signal": "V_BATT"
          },
          {
            "name": "GND",
            "type": "ground",
            "signal": "GND"
          }
        ],
        "dimensions": {
          "width": 65,
          "height": 35,
          "depth": 8
        },
        "purchaseUrl": "https://www.adafruit.com"
      },
      {
        "id": "node-primary-sensor",
        "name": "Multisensor Breakout (I2C / SPI)",
        "productName": "BME688 Air Quality & Environmental Sensor",
        "category": "electrical",
        "type": "sensor",
        "vendor": "SparkFun",
        "vendor_sku": "SEN-19096",
        "price": 19.95,
        "quantity": 1,
        "inStock": true,
        "stockCount": 560,
        "pins": [
          {
            "name": "VCC",
            "type": "power",
            "signal": "3.3V"
          },
          {
            "name": "GND",
            "type": "ground",
            "signal": "GND"
          },
          {
            "name": "SDA",
            "type": "i2c",
            "signal": "SDA"
          },
          {
            "name": "SCL",
            "type": "i2c",
            "signal": "SCL"
          }
        ],
        "dimensions": {
          "width": 25,
          "height": 18,
          "depth": 4
        },
        "purchaseUrl": "https://www.sparkfun.com"
      },
      {
        "id": "node-display-ui",
        "name": "OLED / E-Ink Visual Display",
        "productName": "1.54-inch SPI High-Contrast Display",
        "category": "electrical",
        "type": "display",
        "vendor": "Waveshare",
        "vendor_sku": "WS-154-SPI",
        "price": 11.2,
        "quantity": 1,
        "inStock": true,
        "stockCount": 890,
        "pins": [
          {
            "name": "VCC",
            "type": "power",
            "signal": "3.3V"
          },
          {
            "name": "GND",
            "type": "ground",
            "signal": "GND"
          },
          {
            "name": "MOSI",
            "type": "spi",
            "signal": "SPI_MOSI"
          },
          {
            "name": "SCK",
            "type": "spi",
            "signal": "SPI_CLK"
          },
          {
            "name": "CS",
            "type": "gpio",
            "signal": "SPI_CS"
          }
        ],
        "dimensions": {
          "width": 42,
          "height": 38,
          "depth": 5
        },
        "purchaseUrl": "https://www.waveshare.com"
      },
      {
        "id": "node-chassis-custom",
        "name": "Parametric Protective Enclosure",
        "productName": "Blueprint Gen-CAD Custom Enclosure (PETG)",
        "category": "3d_printed",
        "type": "enclosure",
        "vendor": "Custom 3D Print / ForgeCAD",
        "vendor_sku": "CAD-GEN-ENCL-01",
        "price": 12,
        "quantity": 1,
        "material": "PETG / Tough Resin",
        "printSettings": {
          "layerHeight": 0.2,
          "infill": 30,
          "support": false
        },
        "inStock": true,
        "stockCount": 999,
        "dimensions": {
          "width": 120,
          "height": 80,
          "depth": 35
        }
      }
    ],
    "electricalConnections": [
      {
        "id": "gen-w1",
        "fromNode": "node-power-unit",
        "fromPin": "V+",
        "toNode": "node-core-mcu",
        "toPin": "3V3",
        "color": "#ef4444",
        "label": "Power Rail"
      },
      {
        "id": "gen-w2",
        "fromNode": "node-power-unit",
        "fromPin": "GND",
        "toNode": "node-core-mcu",
        "toPin": "GND",
        "color": "#1f2937",
        "label": "Common Ground"
      },
      {
        "id": "gen-w3",
        "fromNode": "node-core-mcu",
        "fromPin": "3V3",
        "toNode": "node-primary-sensor",
        "toPin": "VCC",
        "color": "#f59e0b",
        "label": "3.3V Sensor Power"
      },
      {
        "id": "gen-w4",
        "fromNode": "node-core-mcu",
        "fromPin": "GND",
        "toNode": "node-primary-sensor",
        "toPin": "GND",
        "color": "#1f2937",
        "label": "GND"
      },
      {
        "id": "gen-w5",
        "fromNode": "node-core-mcu",
        "fromPin": "SDA",
        "toNode": "node-primary-sensor",
        "toPin": "SDA",
        "color": "#3b82f6",
        "label": "I2C SDA"
      },
      {
        "id": "gen-w6",
        "fromNode": "node-core-mcu",
        "fromPin": "SCL",
        "toNode": "node-primary-sensor",
        "toPin": "SCL",
        "color": "#10b981",
        "label": "I2C SCL"
      },
      {
        "id": "gen-w7",
        "fromNode": "node-core-mcu",
        "fromPin": "3V3",
        "toNode": "node-display-ui",
        "toPin": "VCC",
        "color": "#f59e0b",
        "label": "3.3V Display Power"
      },
      {
        "id": "gen-w8",
        "fromNode": "node-core-mcu",
        "fromPin": "GND",
        "toNode": "node-display-ui",
        "toPin": "GND",
        "color": "#1f2937",
        "label": "GND"
      }
    ],
    "mechanicalConnections": [
      {
        "parentNode": "node-chassis-custom",
        "childNode": "node-core-mcu",
        "type": "M2.5 Heat-set Inserts & Screws",
        "count": 4
      },
      {
        "parentNode": "node-chassis-custom",
        "childNode": "node-display-ui",
        "type": "Snap-fit Front Bezel",
        "count": 1
      }
    ],
    "instructions": [
      {
        "step": 1,
        "title": "Print 3D Enclosure & Prepare Fasteners",
        "description": "3D print the top and bottom shell using PETG filament. Clean out heat-set insert pockets.",
        "tools": [
          "3D Printer",
          "Soldering Iron for Inserts",
          "M2.5 Hardware"
        ],
        "subSteps": [
          "Preheat soldering iron to 230°C to press M2.5 brass threaded inserts into the mounting bosses.",
          "Inspect display cutout for stringing or rough overhangs."
        ]
      },
      {
        "step": 2,
        "title": "Circuit Soldering & Wire Routing",
        "description": "Connect the sensor, microcontroller, and power regulation module using 28 AWG silicone wire.",
        "tools": [
          "Soldering Iron",
          "Wire Strippers",
          "Flux & Solder"
        ],
        "subSteps": [
          "Connect power rails ensuring strict reverse-polarity prevention.",
          "Route I2C bus wiring directly between MCU SDA/SCL and sensor pins."
        ]
      },
      {
        "step": 3,
        "title": "Final Assembly & Firmware Flashing",
        "description": "Mount the PCB into the enclosure, fasten the lid with M2.5 hex bolts, and upload initial firmware.",
        "tools": [
          "M2.5 Hex Driver",
          "USB-C Cable"
        ],
        "subSteps": [
          "Secure all components and verify no loose wiring interferes with the lid.",
          "Plug in USB-C and flash firmware via serial interface."
        ]
      }
    ]
  },
  {
    "id": "proj-bionic-smart-prosthetic-hand-fl6o",
    "projectName": "Bionic Smart Prosthetic Hand",
    "description": "5-finger EMG-controlled robotic bionic hand with tactile pressure feedback and servo tensioning",
    "category": "Robotics",
    "stars": 1,
    "author": "Antigravity Engineer",
    "authorAvatar": "AN",
    "created_at": "2026-11-17T07:56:50.304Z",
    "thumbnail": "/landing/images/hero-dog.webp",
    "renderImage": "/landing/images/hero-dog.webp",
    "estimatedCost": 66.15,
    "buildTime": "4-6 hours",
    "difficulty": "Advanced",
    "specs": {
      "mcu": "ESP32-S3 Dual-Core MCU",
      "power": "3.7V 2500mAh LiPo Battery",
      "connectivity": "WiFi 802.11 b/g/n, BLE 5.0",
      "sensors": "Environmental Telemetry, High-Accuracy ADC",
      "weight": "220 g",
      "dimensions": "120 x 80 x 35 mm"
    },
    "nodes": [
      {
        "id": "node-core-mcu",
        "name": "ESP32-S3 Dual-Core MCU",
        "productName": "ESP32-S3-WROOM-1",
        "category": "electrical",
        "type": "microcontroller",
        "vendor": "DigiKey",
        "vendor_sku": "ESP32-S3-WROOM-1-ND",
        "price": 8.5,
        "quantity": 1,
        "inStock": true,
        "stockCount": 1850,
        "pins": [
          {
            "name": "3V3",
            "type": "power",
            "signal": "3.3V"
          },
          {
            "name": "GND",
            "type": "ground",
            "signal": "GND"
          },
          {
            "name": "SDA",
            "type": "i2c",
            "signal": "SDA"
          },
          {
            "name": "SCL",
            "type": "i2c",
            "signal": "SCL"
          },
          {
            "name": "GPIO4",
            "type": "gpio",
            "signal": "D4"
          },
          {
            "name": "GPIO5",
            "type": "gpio",
            "signal": "D5"
          },
          {
            "name": "TX",
            "type": "uart",
            "signal": "UART_TX"
          },
          {
            "name": "RX",
            "type": "uart",
            "signal": "UART_RX"
          }
        ],
        "dimensions": {
          "width": 50,
          "height": 25,
          "depth": 6
        },
        "purchaseUrl": "https://www.digikey.com"
      },
      {
        "id": "node-power-unit",
        "name": "3.7V 2500mAh LiPo Battery",
        "productName": "High-Density Energy Storage Unit",
        "category": "electrical",
        "type": "battery",
        "vendor": "Adafruit",
        "vendor_sku": "AF-BAT-2500",
        "price": 14.5,
        "quantity": 1,
        "inStock": true,
        "stockCount": 420,
        "pins": [
          {
            "name": "V+",
            "type": "power",
            "signal": "V_BATT"
          },
          {
            "name": "GND",
            "type": "ground",
            "signal": "GND"
          }
        ],
        "dimensions": {
          "width": 65,
          "height": 35,
          "depth": 8
        },
        "purchaseUrl": "https://www.adafruit.com"
      },
      {
        "id": "node-primary-sensor",
        "name": "Multisensor Breakout (I2C / SPI)",
        "productName": "BME688 Air Quality & Environmental Sensor",
        "category": "electrical",
        "type": "sensor",
        "vendor": "SparkFun",
        "vendor_sku": "SEN-19096",
        "price": 19.95,
        "quantity": 1,
        "inStock": true,
        "stockCount": 560,
        "pins": [
          {
            "name": "VCC",
            "type": "power",
            "signal": "3.3V"
          },
          {
            "name": "GND",
            "type": "ground",
            "signal": "GND"
          },
          {
            "name": "SDA",
            "type": "i2c",
            "signal": "SDA"
          },
          {
            "name": "SCL",
            "type": "i2c",
            "signal": "SCL"
          }
        ],
        "dimensions": {
          "width": 25,
          "height": 18,
          "depth": 4
        },
        "purchaseUrl": "https://www.sparkfun.com"
      },
      {
        "id": "node-display-ui",
        "name": "OLED / E-Ink Visual Display",
        "productName": "1.54-inch SPI High-Contrast Display",
        "category": "electrical",
        "type": "display",
        "vendor": "Waveshare",
        "vendor_sku": "WS-154-SPI",
        "price": 11.2,
        "quantity": 1,
        "inStock": true,
        "stockCount": 890,
        "pins": [
          {
            "name": "VCC",
            "type": "power",
            "signal": "3.3V"
          },
          {
            "name": "GND",
            "type": "ground",
            "signal": "GND"
          },
          {
            "name": "MOSI",
            "type": "spi",
            "signal": "SPI_MOSI"
          },
          {
            "name": "SCK",
            "type": "spi",
            "signal": "SPI_CLK"
          },
          {
            "name": "CS",
            "type": "gpio",
            "signal": "SPI_CS"
          }
        ],
        "dimensions": {
          "width": 42,
          "height": 38,
          "depth": 5
        },
        "purchaseUrl": "https://www.waveshare.com"
      },
      {
        "id": "node-chassis-custom",
        "name": "Parametric Protective Enclosure",
        "productName": "Blueprint Gen-CAD Custom Enclosure (PETG)",
        "category": "3d_printed",
        "type": "enclosure",
        "vendor": "Custom 3D Print / ForgeCAD",
        "vendor_sku": "CAD-GEN-ENCL-01",
        "price": 12,
        "quantity": 1,
        "material": "PETG / Tough Resin",
        "printSettings": {
          "layerHeight": 0.2,
          "infill": 30,
          "support": false
        },
        "inStock": true,
        "stockCount": 999,
        "dimensions": {
          "width": 120,
          "height": 80,
          "depth": 35
        }
      }
    ],
    "electricalConnections": [
      {
        "id": "gen-w1",
        "fromNode": "node-power-unit",
        "fromPin": "V+",
        "toNode": "node-core-mcu",
        "toPin": "3V3",
        "color": "#ef4444",
        "label": "Power Rail"
      },
      {
        "id": "gen-w2",
        "fromNode": "node-power-unit",
        "fromPin": "GND",
        "toNode": "node-core-mcu",
        "toPin": "GND",
        "color": "#1f2937",
        "label": "Common Ground"
      },
      {
        "id": "gen-w3",
        "fromNode": "node-core-mcu",
        "fromPin": "3V3",
        "toNode": "node-primary-sensor",
        "toPin": "VCC",
        "color": "#f59e0b",
        "label": "3.3V Sensor Power"
      },
      {
        "id": "gen-w4",
        "fromNode": "node-core-mcu",
        "fromPin": "GND",
        "toNode": "node-primary-sensor",
        "toPin": "GND",
        "color": "#1f2937",
        "label": "GND"
      },
      {
        "id": "gen-w5",
        "fromNode": "node-core-mcu",
        "fromPin": "SDA",
        "toNode": "node-primary-sensor",
        "toPin": "SDA",
        "color": "#3b82f6",
        "label": "I2C SDA"
      },
      {
        "id": "gen-w6",
        "fromNode": "node-core-mcu",
        "fromPin": "SCL",
        "toNode": "node-primary-sensor",
        "toPin": "SCL",
        "color": "#10b981",
        "label": "I2C SCL"
      },
      {
        "id": "gen-w7",
        "fromNode": "node-core-mcu",
        "fromPin": "3V3",
        "toNode": "node-display-ui",
        "toPin": "VCC",
        "color": "#f59e0b",
        "label": "3.3V Display Power"
      },
      {
        "id": "gen-w8",
        "fromNode": "node-core-mcu",
        "fromPin": "GND",
        "toNode": "node-display-ui",
        "toPin": "GND",
        "color": "#1f2937",
        "label": "GND"
      }
    ],
    "mechanicalConnections": [
      {
        "parentNode": "node-chassis-custom",
        "childNode": "node-core-mcu",
        "type": "M2.5 Heat-set Inserts & Screws",
        "count": 4
      },
      {
        "parentNode": "node-chassis-custom",
        "childNode": "node-display-ui",
        "type": "Snap-fit Front Bezel",
        "count": 1
      }
    ],
    "instructions": [
      {
        "step": 1,
        "title": "Print 3D Enclosure & Prepare Fasteners",
        "description": "3D print the top and bottom shell using PETG filament. Clean out heat-set insert pockets.",
        "tools": [
          "3D Printer",
          "Soldering Iron for Inserts",
          "M2.5 Hardware"
        ],
        "subSteps": [
          "Preheat soldering iron to 230°C to press M2.5 brass threaded inserts into the mounting bosses.",
          "Inspect display cutout for stringing or rough overhangs."
        ]
      },
      {
        "step": 2,
        "title": "Circuit Soldering & Wire Routing",
        "description": "Connect the sensor, microcontroller, and power regulation module using 28 AWG silicone wire.",
        "tools": [
          "Soldering Iron",
          "Wire Strippers",
          "Flux & Solder"
        ],
        "subSteps": [
          "Connect power rails ensuring strict reverse-polarity prevention.",
          "Route I2C bus wiring directly between MCU SDA/SCL and sensor pins."
        ]
      },
      {
        "step": 3,
        "title": "Final Assembly & Firmware Flashing",
        "description": "Mount the PCB into the enclosure, fasten the lid with M2.5 hex bolts, and upload initial firmware.",
        "tools": [
          "M2.5 Hex Driver",
          "USB-C Cable"
        ],
        "subSteps": [
          "Secure all components and verify no loose wiring interferes with the lid.",
          "Plug in USB-C and flash firmware via serial interface."
        ]
      }
    ]
  }
];
