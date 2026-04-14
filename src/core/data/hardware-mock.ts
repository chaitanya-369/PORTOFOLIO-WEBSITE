import type { HardwareProject } from '../types/hardware'

export const mockHardwareProject: HardwareProject = {
  id: 'esp32-custom-dev-board',
  slug: 'esp32-custom-dev-board',
  title: 'ESP32 Custom Dev Board',
  description: 'A custom, 4-layer impedance matched PCB designed around the ESP32-S3 IC with integrated LiPo charging, high-speed USB-C, and an integrated IMU for robotics control systems.',
  category: 'pcb',
  modelPath: '/models/esp32-board.glb',
  thumbnailPath: '/images/hardware/esp32-thumb.webp',
  tags: ['Altium', 'ESP32-S3', 'I2C', 'Impedance Matching'],
  dateCompleted: '2025-11-14T00:00:00Z',
  featured: true,
  components: [
    {
      id: 'ic-1-esp32',
      partNumber: 'ESP32-S3-WROOM-1',
      manufacturer: 'Espressif Systems',
      description: 'Dual-core Xtensa LX7 MCU with Wi-Fi and Bluetooth 5 (LE). acts as the central brain of this development board.',
      function: 'Main Microcontroller / RF Transceiver',
      voltage: '3.3V',
      packageType: 'QFN-56 (Custom Module)',
      position: [0, 0.5, 0] // Center
    },
    {
      id: 'ic-2-lipo-charger',
      partNumber: 'BQ24075',
      manufacturer: 'Texas Instruments',
      description: '1.5A USB-compliant Li-Ion battery charger with power path management. Crucial for uninterrupted power during robotics deployment.',
      function: 'Power Management IC (PMIC)',
      voltage: '4.2V max / 5V input',
      packageType: 'VQFN-16',
      position: [-1.2, 0.2, 1.5]
    },
    {
      id: 'ic-3-imu',
      partNumber: 'BNO085',
      manufacturer: 'MEMSIC / CEVA',
      description: '9-axis System in Package (SiP) integrating a triaxial accelerometer, triaxial gyroscope, and magnetometer.',
      function: 'Inertial Measurement Unit (IMU)',
      voltage: '3.3V',
      packageType: 'LGA-28',
      position: [1.5, 0.4, -1]
    }
  ]
}
