import { buildButterflyProject } from './butterflyPreset.js';

export function generateProjectFromPrompt(prompt) {
  const p = prompt.toLowerCase();

  // Dedicated offline preset for flapping-wing robots.
  if (/butterfl|ornithopter|flapping|insect robot|micro ?flyer/.test(p)) {
    return buildButterflyProject(prompt);
  }
  
  let category = "Robotics";
  let title = prompt.length > 40 ? prompt.slice(0, 40) + "..." : prompt;
  title = title.charAt(0).toUpperCase() + title.slice(1);
  
  let mcuName = "ESP32-S3 Dual-Core MCU";
  let mcuSku = "ESP32-S3-WROOM-1";
  let mcuPrice = 8.50;
  let powerSource = "3.7V 2500mAh LiPo Battery";
  
  if (p.includes("drone") || p.includes("quadcopter") || p.includes("flight")) {
    category = "Robotics";
    mcuName = "STM32F405 Flight Controller";
    mcuSku = "STM32F405-FC-V3";
    mcuPrice = 32.00;
    powerSource = "14.8V 4S 1500mAh LiPo Battery";
  } else if (p.includes("weather") || p.includes("environment") || p.includes("garden") || p.includes("plant")) {
    category = "IoT & Environment";
    mcuName = "Raspberry Pi Pico W (RP2040)";
    mcuSku = "SC0918-PICO-W";
    mcuPrice = 6.00;
    powerSource = "3.7V 18650 Li-Ion + 5V Solar Panel";
  } else if (p.includes("watch") || p.includes("wrist") || p.includes("wearable")) {
    category = "Wearables";
    mcuName = "Nordic nRF52840 BLE 5.4 SoC";
    mcuSku = "NRF52840-DONGLE";
    mcuPrice = 12.00;
    powerSource = "3.7V 350mAh Coin LiPo";
  } else if (p.includes("audio") || p.includes("synth") || p.includes("guitar") || p.includes("midi")) {
    category = "Audio";
    mcuName = "Teensy 4.1 600MHz ARM Cortex-M7";
    mcuSku = "TEENSY-41-NE";
    mcuPrice = 31.50;
    powerSource = "9V DC Adapter / 5V USB-C";
  }

  const nodes = [
    {
      id: "node-core-mcu",
      name: mcuName,
      productName: mcuSku,
      category: "electrical",
      type: "microcontroller",
      vendor: "DigiKey",
      vendor_sku: "",
      price: mcuPrice,
      quantity: 1,
      priceEstimate: true,
      pins: [
        { name: "VIN", type: "power", signal: "V_BATT" },
        { name: "3V3", type: "power", signal: "3.3V" },
        { name: "GND", type: "ground", signal: "GND" },
        { name: "SDA", type: "i2c", signal: "SDA" },
        { name: "SCL", type: "i2c", signal: "SCL" },
        { name: "GPIO4", type: "gpio", signal: "D4" },
        { name: "GPIO5", type: "gpio", signal: "D5" },
        { name: "TX", type: "uart", signal: "UART_TX" },
        { name: "RX", type: "uart", signal: "UART_RX" }
      ],
      dimensions: { width: 50, height: 25, depth: 6 },
      purchaseUrl: "https://www.digikey.com"
    },
    {
      id: "node-power-unit",
      name: powerSource,
      productName: "High-Density Energy Storage Unit",
      category: "electrical",
      type: "battery",
      vendor: "Adafruit",
      vendor_sku: "",
      price: 14.50,
      quantity: 1,
      priceEstimate: true,
      pins: [
        { name: "V+", type: "power", signal: "V_BATT" },
        { name: "GND", type: "ground", signal: "GND" }
      ],
      dimensions: { width: 65, height: 35, depth: 8 },
      purchaseUrl: "https://www.adafruit.com"
    },
    {
      id: "node-primary-sensor",
      name: "Multisensor Breakout (I2C / SPI)",
      productName: "BME688 Air Quality & Environmental Sensor",
      category: "electrical",
      type: "sensor",
      vendor: "SparkFun",
      vendor_sku: "",
      price: 19.95,
      quantity: 1,
      priceEstimate: true,
      pins: [
        { name: "VCC", type: "power", signal: "3.3V" },
        { name: "GND", type: "ground", signal: "GND" },
        { name: "SDA", type: "i2c", signal: "SDA" },
        { name: "SCL", type: "i2c", signal: "SCL" }
      ],
      dimensions: { width: 25, height: 18, depth: 4 },
      purchaseUrl: "https://www.sparkfun.com"
    },
    {
      id: "node-display-ui",
      name: "OLED / E-Ink Visual Display",
      productName: "1.54-inch SPI High-Contrast Display",
      category: "electrical",
      type: "display",
      vendor: "Waveshare",
      vendor_sku: "",
      price: 11.20,
      quantity: 1,
      priceEstimate: true,
      pins: [
        { name: "VCC", type: "power", signal: "3.3V" },
        { name: "GND", type: "ground", signal: "GND" },
        { name: "MOSI", type: "spi", signal: "SPI_MOSI" },
        { name: "SCK", type: "spi", signal: "SPI_CLK" },
        { name: "CS", type: "gpio", signal: "SPI_CS" }
      ],
      dimensions: { width: 42, height: 38, depth: 5 },
      purchaseUrl: "https://www.waveshare.com"
    },
    {
      id: "node-chassis-custom",
      name: "Parametric Protective Enclosure",
      productName: "Blueprint Gen-CAD Custom Enclosure (PETG)",
      category: "3d_printed",
      type: "enclosure",
      vendor: "Custom 3D Print / ForgeCAD",
      vendor_sku: "",
      price: 12.00,
      quantity: 1,
      material: "PETG / Tough Resin",
      printSettings: { layerHeight: 0.2, infill: 30, support: false },
      priceEstimate: true,
      dimensions: { width: 120, height: 80, depth: 35 }
    }
  ];

  const electricalConnections = [
    { id: "gen-w1", fromNode: "node-power-unit", fromPin: "V+", toNode: "node-core-mcu", toPin: "VIN", color: "#ef4444", label: "Battery to VIN (check your board's input voltage range)" },
    { id: "gen-w2", fromNode: "node-power-unit", fromPin: "GND", toNode: "node-core-mcu", toPin: "GND", color: "#1f2937", label: "Common Ground" },
    { id: "gen-w3", fromNode: "node-core-mcu", fromPin: "3V3", toNode: "node-primary-sensor", toPin: "VCC", color: "#f59e0b", label: "3.3V Sensor Power" },
    { id: "gen-w4", fromNode: "node-core-mcu", fromPin: "GND", toNode: "node-primary-sensor", toPin: "GND", color: "#1f2937", label: "GND" },
    { id: "gen-w5", fromNode: "node-core-mcu", fromPin: "SDA", toNode: "node-primary-sensor", toPin: "SDA", color: "#3b82f6", label: "I2C SDA" },
    { id: "gen-w6", fromNode: "node-core-mcu", fromPin: "SCL", toNode: "node-primary-sensor", toPin: "SCL", color: "#10b981", label: "I2C SCL" },
    { id: "gen-w7", fromNode: "node-core-mcu", fromPin: "3V3", toNode: "node-display-ui", toPin: "VCC", color: "#f59e0b", label: "3.3V Display Power" },
    { id: "gen-w8", fromNode: "node-core-mcu", fromPin: "GND", toNode: "node-display-ui", toPin: "GND", color: "#1f2937", label: "GND" }
  ];

  const totalCost = nodes.reduce((acc, n) => acc + (n.price * n.quantity), 0);

  return {
    id: "proj-" + Math.random().toString(36).substring(2, 9),
    projectName: title,
    description: `Template starting point for: "${prompt}". Edit the parts and wiring to match your idea.`,
    category: category,
    stars: 1,
    author: "You",
    authorAvatar: "YO",
    created_at: new Date().toISOString(),
    thumbnail: null,
    renderImage: null,
    estimatedCost: parseFloat(totalCost.toFixed(2)),
    buildTime: "3-5 hours",
    difficulty: "Intermediate",
    specs: {
      mcu: mcuName,
      power: powerSource,
      connectivity: "WiFi 802.11 b/g/n, BLE 5.0",
      sensors: "Environmental Telemetry, High-Accuracy ADC",
      dimensions: "120 x 80 x 35 mm"
    },
    nodes,
    electricalConnections,
    mechanicalConnections: [
      { parentNode: "node-chassis-custom", childNode: "node-core-mcu", type: "M2.5 Heat-set Inserts & Screws", count: 4 },
      { parentNode: "node-chassis-custom", childNode: "node-display-ui", type: "Snap-fit Front Bezel", count: 1 }
    ],
    instructions: [
      {
        step: 1,
        title: "Print 3D Enclosure & Prepare Fasteners",
        description: "3D print the top and bottom shell using PETG filament. Clean out heat-set insert pockets.",
        tools: ["3D Printer", "Soldering Iron for Inserts", "M2.5 Hardware"],
        subSteps: [
          "Preheat soldering iron to 230°C to press M2.5 brass threaded inserts into the mounting bosses.",
          "Inspect display cutout for stringing or rough overhangs."
        ]
      },
      {
        step: 2,
        title: "Circuit Soldering & Wire Routing",
        description: "Connect the sensor, microcontroller, and power regulation module using 28 AWG silicone wire.",
        tools: ["Soldering Iron", "Wire Strippers", "Flux & Solder"],
        subSteps: [
          "Connect power rails ensuring strict reverse-polarity prevention.",
          "Route I2C bus wiring directly between MCU SDA/SCL and sensor pins."
        ]
      },
      {
        step: 3,
        title: "Final Assembly & Firmware Flashing",
        description: "Mount the PCB into the enclosure, fasten the lid with M2.5 hex bolts, and upload initial firmware.",
        tools: ["M2.5 Hex Driver", "USB-C Cable"],
        subSteps: [
          "Secure all components and verify no loose wiring interferes with the lid.",
          "Plug in USB-C and flash firmware via serial interface."
        ]
      }
    ]
  };
}
