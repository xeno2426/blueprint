// Offline preset for a flapping-wing micro robot ("butterfly" / ornithopter).
// All masses and prices are ROUGH ESTIMATES (weightG in grams, price in USD).
// Pin choices avoid the ESP32-C3 strapping pins (GPIO2, 8, 9) and the USB pins (18, 19).
import { recomputeTotals } from './validateProject.js';

export function buildButterflyProject(prompt) {
  const est = { priceEstimate: true, inStock: null };
  const nodes = [
    {
      id: 'node-core-mcu', name: 'ESP32-C3 SuperMini', productName: 'ESP32-C3 SuperMini (headers removed)',
      category: 'electrical', type: 'microcontroller', vendor: 'Generic', vendor_sku: '', price: 3, quantity: 1, weightG: 2.0, ...est,
      pins: [
        { name: '3V3', type: 'power', signal: '3.3V' }, { name: 'GND', type: 'ground', signal: 'GND' },
        { name: 'GPIO5', type: 'i2c', signal: 'SDA' }, { name: 'GPIO6', type: 'i2c', signal: 'SCL' },
        { name: 'GPIO0', type: 'pwm', signal: 'WING_L_A' }, { name: 'GPIO1', type: 'pwm', signal: 'WING_L_B' },
        { name: 'GPIO3', type: 'pwm', signal: 'WING_R_A' }, { name: 'GPIO4', type: 'pwm', signal: 'WING_R_B' },
        { name: 'GPIO7', type: 'pwm', signal: 'TAIL_SERVO' }, { name: 'GPIO10', type: 'gpio', signal: 'IR_LED' },
        { name: '5V', type: 'power', signal: 'V_BATT' },
        { name: 'GPIO20', type: 'gpio', signal: 'SPARE_1' }, { name: 'GPIO21', type: 'gpio', signal: 'SPARE_2' }
      ],
      dimensions: { width: 22.5, height: 18, depth: 4 }
    },
    {
      id: 'node-imu', name: '6-axis IMU breakout', productName: 'ICM-42688-P or MPU-6050 (bare board)',
      category: 'electrical', type: 'sensor', vendor: 'Generic', vendor_sku: '', price: 7, quantity: 1, weightG: 0.5, ...est,
      pins: [
        { name: 'VCC', type: 'power', signal: '3.3V' }, { name: 'GND', type: 'ground', signal: 'GND' },
        { name: 'SDA', type: 'i2c', signal: 'SDA' }, { name: 'SCL', type: 'i2c', signal: 'SCL' }
      ],
      dimensions: { width: 15, height: 12, depth: 2 }
    },
    {
      id: 'node-driver', name: 'DRV8833 dual H-bridge', productName: 'DRV8833 mini driver',
      category: 'electrical', type: 'motor_driver', vendor: 'Generic', vendor_sku: '', price: 2, quantity: 1, weightG: 0.6, ...est,
      pins: [
        { name: 'VM', type: 'power', signal: 'V_BATT' }, { name: 'GND', type: 'ground', signal: 'GND' },
        { name: 'IN1', type: 'pwm', signal: 'WING_L_A' }, { name: 'IN2', type: 'pwm', signal: 'WING_L_B' },
        { name: 'IN3', type: 'pwm', signal: 'WING_R_A' }, { name: 'IN4', type: 'pwm', signal: 'WING_R_B' },
        { name: 'OUT1', type: 'power', signal: 'MOTOR_L+' }, { name: 'OUT2', type: 'power', signal: 'MOTOR_L-' },
        { name: 'OUT3', type: 'power', signal: 'MOTOR_R+' }, { name: 'OUT4', type: 'power', signal: 'MOTOR_R-' }
      ],
      dimensions: { width: 12, height: 10, depth: 2 }
    },
    {
      id: 'node-motor-left', name: 'Left wing motor + gearbox', productName: '615 coreless motor with ~1:25 gearbox',
      category: 'electrical', type: 'motor', vendor: 'Generic', vendor_sku: '', price: 4, quantity: 1, weightG: 2.3, ...est,
      pins: [{ name: 'M+', type: 'power', signal: 'MOTOR_L+' }, { name: 'M-', type: 'power', signal: 'MOTOR_L-' }],
      dimensions: { width: 6, height: 6, depth: 24 }
    },
    {
      id: 'node-motor-right', name: 'Right wing motor + gearbox', productName: '615 coreless motor with ~1:25 gearbox',
      category: 'electrical', type: 'motor', vendor: 'Generic', vendor_sku: '', price: 4, quantity: 1, weightG: 2.3, ...est,
      pins: [{ name: 'M+', type: 'power', signal: 'MOTOR_R+' }, { name: 'M-', type: 'power', signal: 'MOTOR_R-' }],
      dimensions: { width: 6, height: 6, depth: 24 }
    },
    {
      id: 'node-tail-servo', name: 'Tail pitch servo', productName: '1.7 g micro servo',
      category: 'electrical', type: 'servo', vendor: 'Generic', vendor_sku: '', price: 4, quantity: 1, weightG: 1.7, ...est,
      pins: [
        { name: 'V+', type: 'power', signal: 'V_BATT' }, { name: 'GND', type: 'ground', signal: 'GND' },
        { name: 'SIG', type: 'pwm', signal: 'TAIL_SERVO' }
      ],
      dimensions: { width: 8, height: 4, depth: 12 }
    },
    {
      id: 'node-battery', name: '1S LiPo 100 mAh (20C+)', productName: '3.7V 100 mAh LiPo with protection',
      category: 'electrical', type: 'battery', vendor: 'Generic', vendor_sku: '', price: 4, quantity: 1, weightG: 3.0, ...est,
      pins: [{ name: 'V+', type: 'power', signal: 'V_BATT' }, { name: 'GND', type: 'ground', signal: 'GND' }],
      dimensions: { width: 20, height: 15, depth: 5 }
    },
    {
      id: 'node-cap', name: 'Bulk capacitor 220 uF', productName: '220 uF low-ESR capacitor across motor supply',
      category: 'electrical', type: 'capacitor', vendor: 'Generic', vendor_sku: '', price: 0.5, quantity: 1, weightG: 0.3, ...est,
      pins: [{ name: '+', type: 'power', signal: 'V_BATT' }, { name: '-', type: 'ground', signal: 'GND' }],
      dimensions: { width: 5, height: 5, depth: 6 }
    },
    {
      id: 'node-ir-led', name: 'IR LED + 100 ohm resistor', productName: '940 nm IR LED for camera tracking',
      category: 'electrical', type: 'led', vendor: 'Generic', vendor_sku: '', price: 0.3, quantity: 1, weightG: 0.1, ...est,
      pins: [{ name: 'A', type: 'gpio', signal: 'IR_LED' }, { name: 'K', type: 'ground', signal: 'GND' }],
      dimensions: { width: 3, height: 3, depth: 5 }
    },
    {
      id: 'node-frame', name: 'Frame, crank and wing kit', productName: '0.5 mm carbon rods, 0.5 mm piano wire, Mylar film, CA glue, magnet wire',
      category: 'raw_material', type: 'structure', vendor: 'Generic', vendor_sku: '', price: 15, quantity: 1, weightG: 3.3, ...est,
      dimensions: { width: 280, height: 20, depth: 120 }
    }
  ];

  const w = (id, fromNode, fromPin, toNode, toPin, color, label) => ({ id, fromNode, fromPin, toNode, toPin, color, label });
  const electricalConnections = [
    w('b1', 'node-battery', 'V+', 'node-core-mcu', '5V', '#ef4444', 'Battery +'),
    w('b2', 'node-battery', 'GND', 'node-core-mcu', 'GND', '#1f2937', 'Battery GND'),
    w('b3', 'node-battery', 'V+', 'node-driver', 'VM', '#ef4444', 'Motor supply'),
    w('b4', 'node-battery', 'GND', 'node-driver', 'GND', '#1f2937', 'Driver GND'),
    w('b5', 'node-battery', 'V+', 'node-tail-servo', 'V+', '#ef4444', 'Servo supply'),
    w('b6', 'node-battery', 'GND', 'node-tail-servo', 'GND', '#1f2937', 'Servo GND'),
    w('b7', 'node-battery', 'V+', 'node-cap', '+', '#ef4444', 'Cap +'),
    w('b8', 'node-battery', 'GND', 'node-cap', '-', '#1f2937', 'Cap -'),
    w('b9', 'node-core-mcu', '3V3', 'node-imu', 'VCC', '#f59e0b', 'IMU power'),
    w('b10', 'node-core-mcu', 'GND', 'node-imu', 'GND', '#1f2937', 'IMU GND'),
    w('b11', 'node-core-mcu', 'GPIO5', 'node-imu', 'SDA', '#3b82f6', 'I2C SDA'),
    w('b12', 'node-core-mcu', 'GPIO6', 'node-imu', 'SCL', '#10b981', 'I2C SCL'),
    w('b13', 'node-core-mcu', 'GPIO0', 'node-driver', 'IN1', '#a855f7', 'Left wing A'),
    w('b14', 'node-core-mcu', 'GPIO1', 'node-driver', 'IN2', '#a855f7', 'Left wing B'),
    w('b15', 'node-core-mcu', 'GPIO3', 'node-driver', 'IN3', '#ec4899', 'Right wing A'),
    w('b16', 'node-core-mcu', 'GPIO4', 'node-driver', 'IN4', '#ec4899', 'Right wing B'),
    w('b17', 'node-driver', 'OUT1', 'node-motor-left', 'M+', '#f97316', 'Left motor +'),
    w('b18', 'node-driver', 'OUT2', 'node-motor-left', 'M-', '#f97316', 'Left motor -'),
    w('b19', 'node-driver', 'OUT3', 'node-motor-right', 'M+', '#f97316', 'Right motor +'),
    w('b20', 'node-driver', 'OUT4', 'node-motor-right', 'M-', '#f97316', 'Right motor -'),
    w('b21', 'node-core-mcu', 'GPIO7', 'node-tail-servo', 'SIG', '#06b6d4', 'Tail servo signal'),
    w('b22', 'node-core-mcu', 'GPIO10', 'node-ir-led', 'A', '#eab308', 'IR LED'),
    w('b23', 'node-ir-led', 'K', 'node-core-mcu', 'GND', '#1f2937', 'IR LED GND')
  ];

  const mechanicalConnections = [
    { parentNode: 'node-frame', childNode: 'node-motor-left', type: 'CA glue to body spar', count: 1 },
    { parentNode: 'node-frame', childNode: 'node-motor-right', type: 'CA glue to body spar', count: 1 },
    { parentNode: 'node-frame', childNode: 'node-core-mcu', type: 'Double-sided tape', count: 1 },
    { parentNode: 'node-frame', childNode: 'node-battery', type: 'Velcro or tape, adjustable for balance', count: 1 },
    { parentNode: 'node-frame', childNode: 'node-tail-servo', type: 'CA glue', count: 1 }
  ];

  const step = (n, title, description, tools, subSteps) => ({ step: n, title, description, tools, subSteps });
  const instructions = [
    step(1, 'Lift test (before building anything else)', 'Build one wing pair on one motor and gearbox and measure thrust on a 0.01 g scale.',
      ['0.01 g scale', 'Bench power supply or battery', 'Tape'],
      ['Mount the motor so the wings flap above the scale pan.', 'Record the downward force at several voltages; the thrust must exceed the final robot mass.', 'If thrust is too low: enlarge wings, lighten the frame, or raise flap frequency.']),
    step(2, 'Build the frame and wings', 'Cut carbon rods for the body and spars, form piano-wire cranks, and glue Mylar wings.',
      ['Hobby knife', 'CA glue', 'Pliers'],
      ['Keep both wings the same mass and span; asymmetry will roll the robot.', 'Weigh every piece as you go and update the BOM mass.']),
    step(3, 'Solder the electronics', 'Remove header pins, then wire the MCU, IMU, driver and servo with enameled magnet wire.',
      ['Fine-tip iron', 'Magnet wire', 'Flux'],
      ['Place the 220 uF capacitor across the motor supply, close to the driver.', 'Check polarity on the LiPo before the first power-up.', 'Use GPIO5/GPIO6 for I2C as in the wiring tab; avoid GPIO2, 8 and 9.']),
    step(4, 'Tethered flight on a rod', 'Slide the robot on a vertical rod so it can climb and rotate but not fly away.',
      ['Thin rod', 'Soft landing surface'],
      ['Tune the IMU control loop for roll and yaw with differential wing speed.', 'Add a failsafe: motors off if the radio link or IMU stops responding.']),
    step(5, 'Free flight and swarm link', 'Fly in a large room over a soft floor, then add an ESP-NOW link to a PC gateway.',
      ['PC with a second ESP32 as gateway'],
      ['Give each butterfly a unique ID byte in every packet.', 'Keep stabilization on the robot; the PC sends only high-level commands.'])
  ];

  const base = {
    id: 'proj-' + Math.random().toString(36).substring(2, 9),
    projectName: 'Flapping-wing robotic butterfly',
    description: `Offline preset for: "${prompt}". Two independent wing drives plus a tail servo, with onboard IMU stabilization.`,
    category: 'Robotics', stars: 1, author: 'You', authorAvatar: 'YO',
    created_at: new Date().toISOString(),
    thumbnail: null, renderImage: null,
    buildTime: 'Several weekends', difficulty: 'Advanced',
    targetMassG: 13,
    specs: {
      mcu: 'ESP32-C3 SuperMini', power: '1S LiPo 100 mAh',
      connectivity: 'ESP-NOW to PC gateway', sensors: '6-axis IMU',
      dimensions: '~280 x 20 x 120 mm (wingspan x body)'
    },
    warnings: [
      'All masses and prices are rough estimates. Verify with a scale.',
      'Lift is unproven: run the tethered lift test before committing to the full build.'
    ],
    nodes, electricalConnections, mechanicalConnections, instructions
  };
  return recomputeTotals(base);
}
