import { useState, useEffect, useRef } from 'react'
import {
  Box,
  Container,
  Heading,
  VStack,
  Text,
  Button,
  HStack,
} from '@chakra-ui/react'
import { useParams, useNavigate } from 'react-router-dom'
import Confetti from 'react-confetti'
import { FaLongArrowAltDown } from 'react-icons/fa'

interface LotteryData {
  id: string
  participants: string[]
  tasks: string[]
  createdAt: number
  winner?: string
  rotationDegree?: number
}

const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD',
  '#D4A5A5', '#9370DB', '#20B2AA', '#FF69B4', '#DDA0DD',
]

const SingleTaskLottery = () => {
  const [participants, setParticipants] = useState<string[]>([])
  const [task, setTask] = useState('')
  const [winner, setWinner] = useState<string | null>(null)
  const [isFirstRun, setIsFirstRun] = useState(true)
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const wheelRef = useRef<number>()
  const { id } = useParams()
  const navigate = useNavigate()

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
      setParticipants(data.participants)
      setTask(data.tasks[0])

      if (data.winner && data.rotationDegree !== undefined) {
        setWinner(data.winner)
        setRotation(data.rotationDegree)
        setShowConfetti(true)
      } else {
        // Instead of just setting initial state, trigger runAgain
        // setTimeout(() => {
        //   runAgain()
        // }, 500) // Small delay to ensure all states are set
      }
    } catch (err) {
      navigate('/create')
    }
  }, [id, navigate])

  const getWinnerFromRotation = (degrees: number) => {
    const normalizedDegrees = degrees % 360
    const segmentSize = 360 / participants.length
    const index = Math.floor(normalizedDegrees / segmentSize)
    return participants[(participants.length - index - 1) % participants.length]
  }

  const spin = () => {
    if (isSpinning) return

    setIsSpinning(true)
    setWinner(null)
    setShowConfetti(false)
    setIsFirstRun(false)

    const minSpins = 5
    const maxSpins = 8
    const spins = minSpins + Math.random() * (maxSpins - minSpins)
    const extraDegrees = Math.random() * 360
    const totalRotation = spins * 360 + extraDegrees
    const duration = 5000

    let startTime: number | null = null
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Cubic easing out
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const currentRotation = totalRotation * easeOut

      setRotation(currentRotation)

      if (progress < 1) {
        wheelRef.current = requestAnimationFrame(animate)
      } else {
        // Calculate winner first
        const selectedWinner = getWinnerFromRotation(currentRotation)
        
        // Update localStorage first
        const lotteryData = localStorage.getItem(`lottery_${id}`)
        if (lotteryData) {
          const data: LotteryData = JSON.parse(lotteryData)
          data.winner = selectedWinner
          data.rotationDegree = currentRotation
          localStorage.setItem(`lottery_${id}`, JSON.stringify(data))
        }

        // Then update UI states in sequence with small delays
        setIsSpinning(false)
        
        // Set winner after a small delay to ensure the wheel has visually stopped
        setTimeout(() => {
          setWinner(selectedWinner)
          // Show confetti after winner is set
          setTimeout(() => {
            setShowConfetti(true)
          }, 50)
        }, 100)
      }
    }

    wheelRef.current = requestAnimationFrame(animate)
  }

  const runAgain = () => {
    if (isSpinning) return

    // Clear stored result
    const lotteryData = localStorage.getItem(`lottery_${id}`)
    if (lotteryData) {
      const data: LotteryData = JSON.parse(lotteryData)
      delete data.winner
      delete data.rotationDegree
      localStorage.setItem(`lottery_${id}`, JSON.stringify(data))
    }

    setRotation(0)
    setIsFirstRun(false)
    setTimeout(spin, 100)
  }

  useEffect(() => {
    return () => {
      if (wheelRef.current) {
        cancelAnimationFrame(wheelRef.current)
      }
    }
  }, [])

  const getSegmentPath = (index: number) => {
    // For single participant, draw a full circle
    if (participants.length === 1) {
      return `M 0 0 L 200 0 A 200 200 0 1 1 199.99 0 Z`
    }

    const angle = 360 / participants.length
    const startAngle = (index * angle - 90) * (Math.PI / 180)
    const endAngle = ((index + 1) * angle - 90) * (Math.PI / 180)
    const radius = 200
    const x1 = Math.cos(startAngle) * radius
    const y1 = Math.sin(startAngle) * radius
    const x2 = Math.cos(endAngle) * radius
    const y2 = Math.sin(endAngle) * radius
    return `M 0 0 L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`
  }

  return (
    <Box pt="80px" minH="100vh" bg="gray.50">
      <Container maxW={{ base: "100%", md: "800px" }} py={{ base: 4, md: 8 }} px={{ base: 4, md: 8 }}>
        {showConfetti && <Confetti numberOfPieces={300} recycle={false} />}
        
        <VStack spacing={{ base: 6, md: 8 }} align="center">
          <Heading 
            textAlign="center" 
            fontSize={{ base: "2xl", md: "3xl" }}
            bgGradient="linear(to-r, purple.500, pink.500)"
            bgClip="text"
          >
            {`Who will ${task}?`}
          </Heading>

          {participants.length === 1 ? (
            <Box
              bg="white"
              p={{ base: 4, md: 6 }}
              borderRadius="xl"
              boxShadow="lg"
              textAlign="center"
              mb={4}
              w="100%"
            >
              <Heading
                textAlign="center" 
                fontSize={{ base: "3xl", md: "4xl" }}
                bgGradient="linear(to-r, orange.400, yellow.400)"
                bgClip="text"
                mb={2}
              >
                {participants[0]} will {task}
              </Heading>
            </Box>
          ) : (
            <Box
              bg="white"
              p={{ base: 4, md: 6 }}
              borderRadius="xl"
              boxShadow="lg"
              textAlign="center"
              mb={4}
              w="100%"
            >
              <Heading
                textAlign="center" 
                fontSize={{ base: "3xl", md: "4xl" }}
                bgGradient="linear(to-r, orange.400, yellow.400)"
                bgClip="text"
                mb={2}
              >
                {winner ? `🎉 ${winner} is the winner! 🎉` : 'The winner is...'}
              </Heading>
              {winner && (
                <Text
                  textAlign="center"
                  fontSize={{ base: "lg", md: "xl" }}
                  color="gray.600"
                  mt={2}
                >
                  {/* {winner} will {task} */}
                </Text>
              )}
            </Box>
          )}

          <Box 
            position="relative" 
            w={{ base: "300px", md: "400px" }}
            h={{ base: "300px", md: "400px" }}
            mx="auto"
          >
            <svg
              width="100%"
              height="100%"
              viewBox="-200 -200 400 400"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: isSpinning ? "none" : "transform 0.3s ease-out"
              }}
            >
              {participants.map((participant, index) => {
                const angle = 360 / participants.length
                const centerAngle = (index * angle + angle / 2 - 90) * (Math.PI / 180)
                const textRadius = 160
                const textX = Math.cos(centerAngle) * textRadius
                const textY = Math.sin(centerAngle) * textRadius

                return (
                  <g key={participant}>
                    <path
                      d={getSegmentPath(index)}
                      fill={COLORS[index % COLORS.length]}
                      stroke="white"
                      strokeWidth="2"
                    />
                    <text
                      x={textX}
                      y={textY}
                      fill="white"
                      fontSize={participants.length > 8 ? "14" : "16"}
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${index * angle + angle / 2}, ${textX}, ${textY})`}
                    >
                      {participant}
                    </text>
                  </g>
                )
              })}
            </svg>
            <Box
              position="absolute"
              top="-30px"
              left="50%"
              transform="translateX(-50%)"
              width={{ base: "30px", md: "40px" }}
              height={{ base: "45px", md: "60px" }}
              display="flex"
              alignItems="center"
              justifyContent="center"
              filter="drop-shadow(0 2px 8px rgba(255, 165, 0, 0.5))"
            >
              <FaLongArrowAltDown size={30} color="#FF8C00" />
            </Box>
          </Box>

          <HStack spacing={4} mt={6} justify="center" flexWrap={{ base: "wrap", md: "nowrap" }}>
            <Button
              colorScheme="orange"
              size={{ base: "md", md: "lg" }}
              onClick={runAgain}
              isDisabled={isSpinning}
              w={{ base: "full", md: "auto" }}
            >
              {isFirstRun ? "Run Lottery to start" : "Run Again"}
            </Button>
            <Button
              colorScheme="orange"
              variant="outline"
              size={{ base: "md", md: "lg" }}
              onClick={() => navigate('/create')}
              w={{ base: "full", md: "auto" }}
            >
              Create New Lottery
            </Button>
          </HStack>

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

export default SingleTaskLottery 