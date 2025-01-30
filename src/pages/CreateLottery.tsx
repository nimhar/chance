import { useState } from 'react'
import {
  Box,
  Container,
  Heading,
  VStack,
  FormControl,
  Input,
  Button,
  useToast,
  IconButton,
  HStack,
  Switch,
  FormLabel,
  Text,
  Tooltip,
} from '@chakra-ui/react'
import { FaPlus, FaTrash, FaInfoCircle } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

interface Participant {
  id: string
  name: string
}

interface Task {
  id: string
  description: string
}

interface LotteryData {
  id: string
  participants: string[]
  tasks: string[]
  createdAt: number
}

const CreateLottery = () => {
  const [participants, setParticipants] = useState<Participant[]>([{ id: '1', name: '' }])
  const [tasks, setTasks] = useState<Task[]>([{ id: '1', description: '' }])
  const [isMultiTask, setIsMultiTask] = useState(false)
  const [isMatchingMode, setIsMatchingMode] = useState(false)
  const toast = useToast()
  const navigate = useNavigate()

  const addParticipant = () => {
    const newParticipant = { id: Date.now().toString(), name: '' }
    setParticipants([...participants, newParticipant])
    
    // If in multi-task mode, add a corresponding task
    if (isMultiTask) {
      const newTask = { id: Date.now().toString(), description: '' }
      setTasks([...tasks, newTask])
    }
  }

  const removeParticipant = (id: string) => {
    if (participants.length > 1) {
      const updatedParticipants = participants.filter(p => p.id !== id)
      setParticipants(updatedParticipants)
      
      // If in multi-task mode, remove a task to maintain the same count
      if (isMultiTask) {
        const updatedTasks = tasks.slice(0, updatedParticipants.length)
        setTasks(updatedTasks)
      }
    }
  }

  const updateParticipant = (id: string, name: string) => {
    setParticipants(participants.map(p => p.id === id ? { ...p, name } : p))
  }

  const updateTask = (id: string, description: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, description } : t))
  }

  const handleMultiTaskToggle = () => {
    const newIsMultiTask = !isMultiTask
    setIsMultiTask(newIsMultiTask)
    setIsMatchingMode(false)  // Disable matching mode when multi-task is enabled

    if (newIsMultiTask) {
      // When enabling multi-task, create a task for each participant
      const newTasks = participants.map((_, index) => ({
        id: `task-${index + 1}`,
        description: index === 0 ? tasks[0].description : '' // Preserve first task description
      }))
      setTasks(newTasks)
    } else {
      // When disabling multi-task, keep only the first task with its current description
      const firstTaskDescription = tasks[0].description
      setTasks([{ id: '1', description: firstTaskDescription }])
    }
  }

  const handleMatchingModeToggle = () => {
    const newIsMatchingMode = !isMatchingMode
    setIsMatchingMode(newIsMatchingMode)
    setIsMultiTask(true)  // Matching mode is essentially multi-task mode

    if (newIsMatchingMode) {
      // In matching mode, create a task for each participant
      const newTasks = participants.map((participant) => ({
        id: participant.id,
        description: participant.name // Each participant becomes a task
      }))
      setTasks(newTasks)
    } else {
      // When disabling matching mode, reset to default task
      setTasks([{ id: '1', description: '' }])
      setIsMultiTask(false)
    }
  }

  const handleSubmit = () => {
    if (participants.some(p => !p.name.trim())) {
      toast({
        title: 'Error',
        description: 'Please fill in all participant names',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    if (!isMatchingMode && tasks.some(t => !t.description.trim())) {
      toast({
        title: 'Error',
        description: 'Please fill in all task descriptions',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    const lotteryId = Date.now().toString()
    const lotteryData: LotteryData = {
      id: lotteryId,
      participants: participants.map(p => p.name),
      tasks: isMatchingMode ? participants.map(p => p.name) : tasks.map(t => t.description),
      createdAt: Date.now()
    }

    localStorage.setItem(`lottery_${lotteryId}`, JSON.stringify(lotteryData))

    toast({
      title: 'Lottery created!',
      status: 'success',
      duration: 2000,
      isClosable: true,
    })

    // Navigate to the appropriate lottery view
    if (!isMultiTask && !isMatchingMode) {
      navigate(`/single-lottery/${lotteryId}`)
    } else {
      navigate(`/lottery/${lotteryId}`)
    }
  }

  return (
    <Box pt="80px">
      <Container maxW="800px" py={8}>
        <VStack spacing={8} align="stretch">
          <Heading textAlign="center" color="purple.500">Create New Lottery</Heading>
          
          <Box>
            <Heading size="md" mb={4}>Participants</Heading>
            <VStack spacing={4} align="stretch">
              {participants.map((participant, index) => (
                <HStack key={participant.id}>
                  <FormControl isRequired>
                    <Input
                      placeholder={index === 0 ? "e.g., George" : "Enter participant name"}
                      value={participant.name}
                      onChange={(e) => updateParticipant(participant.id, e.target.value)}
                    />
                  </FormControl>
                  <IconButton
                    aria-label="Remove participant"
                    icon={<FaTrash />}
                    colorScheme="red"
                    variant="ghost"
                    isDisabled={participants.length === 1}
                    onClick={() => removeParticipant(participant.id)}
                  />
                </HStack>
              ))}
              <Button leftIcon={<FaPlus />} onClick={addParticipant} variant="ghost">
                Add Participant
              </Button>
            </VStack>
          </Box>

          <Box>
            <HStack justify="space-between" mb={4}>
              {!isMatchingMode && (
                <Heading size="md">Option{isMultiTask ? 's' : ''}</Heading>
              )}
              <HStack spacing={6} ml="auto">
                <HStack>
                  <FormLabel htmlFor="matching-mode" mb="0">
                    <HStack spacing={2}>
                      <Text fontSize="sm" color="gray.600">Matching Mode</Text>
                      <Tooltip 
                        label="Each participant will be randomly paired with another participant (no self-matching allowed)."
                        placement="top"
                        hasArrow
                      >
                        <Box display="inline-block">
                          <FaInfoCircle color="gray" />
                        </Box>
                      </Tooltip>
                    </HStack>
                  </FormLabel>
                  <Switch
                    id="matching-mode"
                    colorScheme="purple"
                    isChecked={isMatchingMode}
                    onChange={handleMatchingModeToggle}
                  />
                </HStack>
                {!isMatchingMode && (
                  <HStack>
                    <FormLabel htmlFor="multi-task" mb="0">
                      <HStack spacing={2}>
                        <Text fontSize="sm" color="gray.600">Multiple Options</Text>
                        <Tooltip 
                          label="In multiple options mode, each participant will be assigned exactly one option. Options will automatically match the number of participants."
                          placement="top"
                          hasArrow
                        >
                          <Box display="inline-block">
                            <FaInfoCircle color="gray" />
                          </Box>
                        </Tooltip>
                      </HStack>
                    </FormLabel>
                    <Switch
                      id="multi-task"
                      colorScheme="purple"
                      isChecked={isMultiTask}
                      onChange={handleMultiTaskToggle}
                      isDisabled={isMatchingMode}
                    />
                  </HStack>
                )}
              </HStack>
            </HStack>
            {!isMatchingMode && (
              <VStack spacing={4} align="stretch">
                {tasks.map((task, index) => (
                  <FormControl key={task.id} isRequired>
                    <Input
                      placeholder={index === 0 ? "e.g., Washing the dishes" : "Enter option here"}
                      value={task.description}
                      onChange={(e) => updateTask(task.id, e.target.value)}
                    />
                  </FormControl>
                ))}
              </VStack>
            )}
          </Box>

          <Button
            colorScheme="purple"
            size="lg"
            onClick={handleSubmit}
          >
            Create Lottery
          </Button>

          {/* Add copyright notice */}
          <Text fontSize="sm" color="gray.500" mt={8}>
            All rights reserved to{' '}
            <a 
              href="https://github.com/nimhar" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ textDecoration: 'underline' }}
            >
              nimhar
            </a>
            {' '}2025
          </Text>
        </VStack>
      </Container>
    </Box>
  )
}

export default CreateLottery 