import { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Heading,
  VStack,
  Text,
  Button,
  Grid,
  GridItem,
  keyframes,
  HStack,
} from '@chakra-ui/react'
import { useParams, useNavigate } from 'react-router-dom'
import Confetti from 'react-confetti'

interface LotteryData {
  id: string
  participants: string[]
  tasks: string[]
  createdAt: number
  finalAssignments?: Assignment[]
}

interface Assignment {
  participant: string
  task: string
  isRevealed: boolean
}

const bounceKeyframes = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`

const ViewLottery = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [showConfetti, setShowConfetti] = useState(false)
  const { id } = useParams()
  const navigate = useNavigate()

  const generateAssignments = (data: LotteryData) => {
    let newAssignments: Assignment[]
    
    // Check if this is a matching lottery (when tasks are same as participants)
    const isMatchingMode = JSON.stringify(data.tasks.sort()) === JSON.stringify(data.participants.sort())
    
    if (isMatchingMode) {
      // Keep original participants order and shuffle who they are paired with
      const originalParticipants = [...data.participants]
      let availablePairs = [...data.participants]
      
      // Keep shuffling until we have a valid arrangement (no self-matches)
      let isValidMatching = false
      while (!isValidMatching) {
        // Fisher-Yates shuffle of available pairs
        for (let i = availablePairs.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [availablePairs[i], availablePairs[j]] = [availablePairs[j], availablePairs[i]]
        }
        
        // Check if any participant is matched with themselves
        isValidMatching = originalParticipants.every((participant, index) => 
          participant !== availablePairs[index]
        )
      }
      
      // Create assignments with original participant order
      newAssignments = originalParticipants.map((participant, index) => ({
        participant,
        task: availablePairs[index], // Store the paired participant in task
        isRevealed: false
      }))
    } else {
      // Regular task mode: Keep participants in order and shuffle tasks
      const originalParticipants = [...data.participants]
      const shuffledTasks = [...data.tasks]
      
      // Shuffle tasks
      for (let i = shuffledTasks.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledTasks[i], shuffledTasks[j]] = [shuffledTasks[j], shuffledTasks[i]]
      }
      
      // Create assignments with original participant order
      newAssignments = originalParticipants.map((participant, index) => ({
        participant,
        task: shuffledTasks[index],
        isRevealed: false
      }))
    }
    
    return newAssignments
  }

  const runAgain = () => {
    const lotteryData = localStorage.getItem(`lottery_${id}`)
    if (!lotteryData) return

    try {
      const data: LotteryData = JSON.parse(lotteryData)
      const newAssignments = generateAssignments(data).map(a => ({ ...a, isRevealed: false }))
      
      // Reset all states
      setShowConfetti(false)
      setAssignments(newAssignments)
      
      // Start revealing after a short delay
      setTimeout(() => {
        revealNext(0, newAssignments)
      }, 1000)
    } catch (err) {
      console.error('Error running lottery again:', err)
    }
  }

  useEffect(() => {
    if (!id) {
      navigate('/create')
      return
    }

    const lotteryData = localStorage.getItem(`lottery_${id}`)
    if (!lotteryData) {
      navigate('/create')
      return
    }

    try {
      const data: LotteryData = JSON.parse(lotteryData)
      
      // Check if we have stored final assignments
      if (data.finalAssignments) {
        setAssignments(data.finalAssignments)
        setShowConfetti(true)
        return
      }
      
      // Generate new assignments
      const newAssignments = generateAssignments(data).map(a => ({ ...a, isRevealed: false }))
      setAssignments(newAssignments)
      
      // Start revealing after 3 seconds
      setTimeout(() => {
        revealNext(0, newAssignments)
      }, 3000)
    } catch (err) {
      navigate('/create')
    }
  }, [id, navigate])

  const revealNext = (index: number, currentAssignments: Assignment[]) => {
    if (index < currentAssignments.length) {
      // Play sound effect
      const audio = new Audio('/reveal-sound.mp3')
      audio.play().catch(() => {})

      // Update the revealed status for the current assignment
      const updatedAssignments = [...currentAssignments]
      updatedAssignments[index] = { ...updatedAssignments[index], isRevealed: true }
      setAssignments(updatedAssignments)

      if (index === currentAssignments.length - 1) {
        setShowConfetti(true)
        // Store final assignments in localStorage
        const lotteryData = localStorage.getItem(`lottery_${id}`)
        if (lotteryData) {
          const data: LotteryData = JSON.parse(lotteryData)
          data.finalAssignments = updatedAssignments
          localStorage.setItem(`lottery_${id}`, JSON.stringify(data))
        }
      } else {
        setTimeout(() => revealNext(index + 1, updatedAssignments), 2000)
      }
    }
  }

  const getRandomColor = () => {
    const colors = [
      'purple.500', 'pink.500', 'blue.500', 'cyan.500', 
      'teal.500', 'green.500', 'orange.500', 'red.500'
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  return (
    <Box pt="80px" minH="100vh" bg="gray.50">
      <Container maxW="800px" py={8}>
        {showConfetti && <Confetti numberOfPieces={300} recycle={false} />}
        
        <VStack spacing={8} align="stretch">
          <Heading 
            textAlign="center"
            bgGradient="linear(to-r, purple.500, pink.500)"
            bgClip="text"
            mb={8}
          >
            🎲 Lottery Results 🎲
          </Heading>

          <Grid
            templateColumns="repeat(2, 1fr)"
            gap={6}
            mx="auto"
            maxW="600px"
          >
            {assignments.map((assignment, index) => (
              <GridItem
                key={index}
                colSpan={2}
                bg="white"
                p={6}
                borderRadius="xl"
                boxShadow="lg"
                opacity={assignment.isRevealed ? 1 : 0.3}
                transform={assignment.isRevealed ? "scale(1)" : "scale(0.95)"}
                transition="all 0.3s ease-in-out"
                animation={assignment.isRevealed ? `${bounceKeyframes} 0.5s ease-in-out` : "none"}
              >
                <VStack spacing={4} align="stretch">
                  <Box>
                    <Text fontSize="sm" color="gray.500" fontWeight="medium">
                      Assignment:
                    </Text>
                    <Text
                      fontSize="xl"
                      fontWeight="bold"
                      bgGradient={`linear(to-r, ${getRandomColor()}, ${getRandomColor()})`}
                      bgClip="text"
                    >
                      {assignment.participant} will be paired to{assignment.isRevealed ? ` ${assignment.task}` : "..."}
                    </Text>
                  </Box>
                </VStack>
              </GridItem>
            ))}
          </Grid>

          {assignments.every(a => a.isRevealed) && (
            <VStack spacing={4} mt={8}>
              <HStack spacing={4}>
                <Button
                  colorScheme="purple"
                  size="lg"
                  onClick={runAgain}
                >
                  Run Again
                </Button>
                <Button
                  variant="outline"
                  colorScheme="purple"
                  size="lg"
                  onClick={() => navigate('/create')}
                >
                  Create New Lottery
                </Button>
              </HStack>
            </VStack>
          )}

          <Text fontSize="sm" color="gray.500" mt={8}>
            All rights reserved to{' '}
            <a 
              href="https://github.com/nimhar" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ textDecoration: 'underline' }}
            >
              Nimrod Harel
            </a>
            {' '}2025
          </Text>
        </VStack>
      </Container>
    </Box>
  )
}

export default ViewLottery 