import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './SummonOption.scss'

type Device = {
  deviceId: string
  name: string
}

type Group = {
  id: string
  name: string
}

type Robot = {
  id: string
  name: string
  shop_name: string
}

type Destination = {
  name: string
  type: string
}

function SummonOption() {
  const [newDevice, setNewDevice] = useState({
    deviceName: '',
    deviceId: '',
    deviceSecret: '',
    region: '',
  })

  const [isAddingDevice, setIsAddingDevice] = useState(false)
  const [isModifyContainerVisible, setIsModifyContainerVisible] = useState(false)
  const showModifyContainer = () => {
    setIsModifyContainerVisible(true)
  }

  const closeModifyContainer = () => {
    setIsModifyContainerVisible(false)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewDevice({ ...newDevice, [name]: value })
  }

  const [isModifyingDeviceName, setIsModifyingDeviceName] = useState(false)
  const [newDeviceName, setNewDeviceName] = useState('')
  const [deviceToModify, setDeviceToModify] = useState<Device | null>(null)

  const [groups, setGroups] = useState<Group[]>([])
  const [robotIds, setRobotIds] = useState<Robot[]>([])
  const [destinations, setDestinations] = useState<Destination[]>([])

  const [selectedGroup, setSelectedGroup] = useState('')
  const [selectedRobot, setSelectedRobot] = useState('')

  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null)
  const [selectedName, setSelectedName] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<string | null>(null)

  const [devices, setDevices] = useState<Device[]>([])

  const [isLoadingDevices, setIsLoadingDevices] = useState(false)
  const [isDevicesVisible, setIsDevicesVisible] = useState(false)
  const [isDeleteContainerVisible, setIsDeleteContainerVisible] = useState(false)

  const [selectedDevice, setSelectedDevice] = useState<string | null>(null)

  const showDeleteContainer = () => {
    setIsDeleteContainerVisible(true)
  }

  const delay = (duration = 1500) => new Promise((res) => setTimeout(res, duration))

  const [robotStatus, setRobotStatus] = useState<{
    robotState: string
    moveState: string
    chargeStage: string
    robotPower?: number
  } | null>(null)

  const addDevice = () => {
    if (Object.values(newDevice).some((value) => value === '')) {
      alert('Please fill in all the fields!')
      return
    }

    axios
      .post('http://127.0.0.1:9050/api/add/device', newDevice)
      .then((response) => {
        if (response.data.code === 10005) {
          alert(response.data.msg)
        } else {
          alert('Device added successfully!')
          setIsAddingDevice(false)
          const addedDevice: Device = {
            deviceId: newDevice.deviceId,
            name: newDevice.deviceName,
          }

          setDevices([...devices, addedDevice])
        }
      })
      .catch((error) => {
        console.error(error)
        alert('Failed to add device!')
      })
  }

  const getAllDevices = () => {
    setIsDevicesVisible(true)
    setIsLoadingDevices(true)

    axios
      .get('http://127.0.0.1:9050/api/devices')
      .then((response) => {
        setDevices(response.data.data.devices)
      })
      .catch((error) => {
        console.error(error)
      })
      .finally(() => {
        setIsLoadingDevices(false)
      })
  }

  const handleOkClick = () => {
    setIsDevicesVisible(false)
  }
  const modifyDeviceName = (device) => {
    const newName = prompt('Enter the new device name:')
    if (newName) {
      axios
        .post('http://127.0.0.1:9050/api/device/name', {
          deviceId: device.deviceId,
          name: newName,
        })
        .then((response) => {
          alert('Device name modified successfully!')

          setDevices(
            devices.map((d) => (d.deviceId === device.deviceId ? { ...d, name: newName } : d))
          )
        })
        .catch((error) => {
          console.error(error)
          alert('Failed to modify device name!')
        })
    }
  }

  const deleteDevice = (deviceId) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this device?')

    if (isConfirmed) {
      axios
        .post('http://127.0.0.1:9050/api/delete/device', { deviceId: deviceId })
        .then((response) => {
          console.log('Device deleted:', response.data)
          alert('Device deleted successfully!')
        })
        .catch((error) => {
          console.error('Error deleting device:', error)
        })
    }
  }

  useEffect(() => {
    if (selectedDevice) {
      setIsLoadingDevices(true)
      axios
        .get(`http://127.0.0.1:9050/api/robot/groups?device=${selectedDevice}`)
        .then(async (response) => {
          await delay()
          setGroups(response.data.data.robotGroups)
        })
        .finally(() => {
          setIsLoadingDevices(false)
        })
    }
  }, [selectedDevice])

  useEffect(() => {
    if (selectedDevice && selectedGroup) {
      axios
        .get(`http://127.0.0.1:9050/api/robots?device=${selectedDevice}&group_id=${selectedGroup}`)
        .then(async (response) => {
          await delay()
          console.log(response.data.data.robots)
          setRobotIds(response.data.data.robots || [])
        })
    }
  }, [selectedDevice, selectedGroup])

  const [isRobotSelected, setIsRobotSelected] = useState(false)

  useEffect(() => {
    if (selectedRobot && selectedDevice && selectedGroup) {
      const params = {
        timeout: 5,
        count: 5,
        device_id: selectedDevice,
        group_id: selectedGroup,
      }
      axios
        .get('http://127.0.0.1:9050/api/robot/state', { params })
        .then((response) => {
          const robotInfo = response.data.data.state[0]
          setRobotStatus({
            robotState: robotInfo.robotState,
            moveState: robotInfo.moveState,
            chargeStage: robotInfo.chargeStage,
            robotPower: robotInfo.robotPower,
          })

          if (robotInfo.robotState === 'free') {
            setIsRobotSelected(true)
          }
        })
        .catch((error) => {
          console.error(error)
        })
    }
  }, [selectedRobot, selectedDevice, selectedGroup])

  useEffect(() => {
    if (selectedDevice && selectedRobot) {
      axios
        .get(
          `http://127.0.0.1:9050/api/robot/map?device_id=${selectedDevice}&robot_id=${selectedRobot}`
        )
        .then(async (response) => {
          await delay()
          const elements = response.data.data.map.elements || []
          setDestinations(elements)
          console.log(elements)
        })
        .catch((error) => {
          console.error(error)
        })
    }
  }, [selectedDevice, selectedRobot])

  const handleSummon = (): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      if (!selectedName || !selectedType) {
        alert('Please select both the destination name and type')
        reject(new Error('Both destination name and type have not been selected.'))
        return
      }

      const payload = {
        deviceId: selectedDevice,
        robotId: selectedRobot,
        destination: {
          name: selectedName,
          type: selectedType,
        },
      }

      axios
        .post('http://127.0.0.1:9050/api/robot/call', payload)
        .then(() => {
          alert('BoT successfully summoned!')
          resolve()
        })
        .catch((error) => {
          console.error(error)
          reject(error)
        })
    })
  }

  const simulateUserInteractions = () => {
    return new Promise((resolve, reject) => {
      // Function to select random item from an array  and setting them to state variables
      const selectRandomItem = (items) => items[Math.floor(Math.random() * items.length)]

      // Randomly select a device and set it
      const randomDevice = selectRandomItem(devices).deviceId
      setSelectedDevice(randomDevice)

      // Simulate user interaction delays
      setTimeout(() => {
        // Randomly select a group if available and set it
        if (groups.length > 0) {
          const randomGroup = selectRandomItem(groups).id
          setSelectedGroup(randomGroup)
        }

        setTimeout(() => {
          // Randomly select a robot if available and set it
          if (robotIds.length > 0) {
            const randomRobot = selectRandomItem(robotIds).id
            setSelectedRobot(randomRobot)
          }

          setTimeout(() => {
            // Randomly select a destination object if available and set both name and type
            if (destinations.length > 0) {
              const randomDestination = selectRandomItem(destinations)
              setSelectedName(randomDestination.name)
              setSelectedType(randomDestination.type)
            }

            // Call the handleSummon function to mimic the Summon action
            handleSummon().then(resolve).catch(reject)
          }, 200)
        }, 200)
      }, 200)
    })
  }

  const loadTest = async (iterations, concurrentSimulations = 10) => {
    console.log(`Starting load test with ${iterations} interactions...`)

    let successes = 0
    let failures = 0
    let totalResponseTime = 0

    const runConcurrentSimulations = async () => {
      const startTime = Date.now()
      const results = await Promise.all(
        Array(concurrentSimulations)
          .fill(null)
          .map(() => simulateUserInteractions())
      )
      const endTime = Date.now()

      for (const result of results) {
        if (result) {
          successes += 1
        } else {
          failures += 1
        }
      }

      totalResponseTime += endTime - startTime
    }

    for (let i = 0; i < Math.ceil(iterations / concurrentSimulations); i++) {
      await runConcurrentSimulations()
    }

    const report = {
      totalInteractions: iterations,
      successes: successes,
      failures: failures,
      averageResponseTime: totalResponseTime / iterations,
    }

    console.log('Load Test Report:', report)

    return report
  }

  const exportToCsv = (report) => {
    console.log('Preparing to export report to CSV...')

    const items = [report]
    const replacer = (key, value) => (value === null ? '' : value)
    const header = Object.keys(items[0])
    const csvData = items.map((row) =>
      header.map((fieldName) => JSON.stringify(row[fieldName], replacer)).join(',')
    )
    csvData.unshift(header.join(','))
    const csvString = csvData.join('\r\n')

    console.log('CSV Data:', csvString)

    const blob = new Blob([csvString], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.setAttribute('hidden', '')
    a.setAttribute('href', url)
    a.setAttribute('download', 'report.csv')
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)

    console.log('CSV export process completed.')
  }

  const startLoadTestAndExport = async () => {
    console.log('Initiating Load Test and CSV Export...')
    const report = await loadTest(20)
    exportToCsv(report)
  }

  return (
    <div className="summon-option-container">
      <h1>PRINGLE ROBOTICS</h1>
      <p className="subtitle">Summon BoTs to Desired Locations </p>
      <div className="add-device-container">
        <button onClick={() => setIsAddingDevice(!isAddingDevice)}>
          {isAddingDevice ? 'Cancel' : 'Add a Device'}
        </button>
        {isAddingDevice && (
          <div>
            <input
              type="text"
              name="deviceName"
              placeholder="Device Name"
              value={newDevice.deviceName}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="deviceId"
              placeholder="Device ID"
              value={newDevice.deviceId}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="deviceSecret"
              placeholder="Device Secret"
              value={newDevice.deviceSecret}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="region"
              placeholder="Region"
              value={newDevice.region}
              onChange={handleInputChange}
            />
            <button onClick={addDevice}>Add Device</button>
          </div>
        )}
      </div>
      <div className="modify-device-name-container">
        <button onClick={showModifyContainer}>Modify Device Name</button>
        {isModifyContainerVisible && (
          <div className="device-list-container">
            {devices.map((device) => (
              <div key={device.deviceId} onClick={() => modifyDeviceName(device)}>
                {device.name} ({device.deviceId})
              </div>
            ))}
            <button onClick={closeModifyContainer}>Exit</button>
          </div>
        )}
      </div>

      <div>
        <div className="buttons-container">
          {isDevicesVisible ? (
            <button className="ok-button" onClick={handleOkClick}>
              Exit
            </button>
          ) : (
            <>
              <button className="get-all-button" onClick={getAllDevices}>
                Get All Devices
              </button>
              <button
                className="delete-device-button"
                onClick={() => setIsDeleteContainerVisible(true)}
              >
                Delete a Device
              </button>
            </>
          )}
        </div>

        {isDevicesVisible && (
          <div className="devices-wrapper">
            <div className="devices-container">
              {isLoadingDevices ? (
                <p>Loading devices...</p>
              ) : (
                <div className="all-devices-container">
                  <h2>All Devices:</h2>
                  {devices.map((device) => (
                    <p key={device.deviceId}>
                      {device.name}: {device.deviceId}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {isDeleteContainerVisible && (
          <div className="delete-wrapper">
            <div className="delete-container">
              {' '}
              <h2>Select a Device to Delete:</h2>
              {devices.map((device) => (
                <div key={device.deviceId} className="device-item">
                  <p onClick={() => setSelectedDevice(device.deviceId)}>
                    {device.name}: {device.deviceId}
                  </p>
                </div>
              ))}
              {selectedDevice && (
                <div className="delete-section">
                  <button className="delete-button" onClick={() => deleteDevice(selectedDevice)}>
                    Delete Selected Device
                  </button>
                </div>
              )}
            </div>
            <button
              className="exit-button"
              onClick={() => {
                setIsDeleteContainerVisible(false)
                setSelectedDevice(null)
              }}
            >
              Exit
            </button>
          </div>
        )}
      </div>

      <div className="option-group">
        <label>Choose Device:</label>

        <select onChange={(e) => setSelectedDevice(e.target.value)}>
          <option value="">Select Device</option>
          {devices.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.name}: {device.deviceId}
            </option>
          ))}
        </select>
      </div>
      <div className="option-group">
        <label>Choose Group:</label>
        <select onChange={(e) => setSelectedGroup(e.target.value)}>
          <option value="">Select Group</option>
          {groups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name} : {group.id}
            </option>
          ))}
        </select>
      </div>
      <div className="option-group">
        <label>Choose Robot:</label>
        <select onChange={(e) => setSelectedRobot(e.target.value)}>
          <option value="">Select Robot</option>
          {robotIds.map((robot) => (
            <option key={robot.id} value={robot.id}>
              {robot.name && robot.name.trim() !== '' ? `${robot.name} : ${robot.id}` : robot.id}
            </option>
          ))}
        </select>
      </div>
      <div className="option-group">
        <label>Robot Status:</label>
        <select>
          <option value="robotState">Robot State: {robotStatus?.robotState || 'N/A'}</option>
          <option value="moveState">Move State: {robotStatus?.moveState || 'N/A'}</option>
          <option value="chargeStage">Charge Stage: {robotStatus?.chargeStage || 'N/A'}</option>
          <option value="robotPower">Robot Power: {robotStatus?.robotPower || 'N/A'}%</option>
        </select>
      </div>
      <div className="option-group">
        <label>Choose Destination Name:</label>
        <select onChange={(e) => setSelectedName(e.target.value)}>
          <option value="">Select Name</option>
          {destinations
            .filter((destination) => destination.name && destination.name.trim() !== '')
            .map((destination) => (
              <option key={destination.name} value={destination.name}>
                {destination.name}
              </option>
            ))}
        </select>

        <label>Choose Destination Type:</label>
        <select onChange={(e) => setSelectedType(e.target.value)}>
          <option value="">Select Type</option>
          {Array.from(new Set(destinations.map((destination) => destination.type))).map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      <button
        className="summon-button"
        disabled={!selectedName || !selectedType}
        onClick={handleSummon}
      >
        Summon BoT
      </button>
    </div>
  )
}

export default SummonOption
