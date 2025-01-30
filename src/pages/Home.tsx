import { Box, Container, Heading, Text, Button, SimpleGrid, Icon, VStack, useColorModeValue } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { FaDice, FaUsers, FaTrophy, FaRandom, FaLaugh } from 'react-icons/fa'

interface FeatureProps {
  icon: React.ElementType
  title: string
  description: string
}

const Feature = ({ icon, title, description }: FeatureProps) => {
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  return (
    <VStack
      p={{ base: 4, md: 6 }}
      bg={bgColor}
      borderRadius="lg"
      border="1px"
      borderColor={borderColor}
      spacing={4}
      align="start"
      transition="transform 0.2s"
      _hover={{ transform: 'translateY(-4px)' }}
    >
      <Icon as={icon} boxSize={{ base: 8, md: 10 }} color="purple.500" />
      <Heading size={{ base: "sm", md: "md" }}>{title}</Heading>
      <Text color="gray.600" fontSize={{ base: "sm", md: "md" }}>{description}</Text>
    </VStack>
  )
}

const Home = () => {
  return (
    <Box pt="80px">
      <Container maxW={{ base: "100%", md: "90%", lg: "1200px" }} py={{ base: 8, md: 16 }} px={{ base: 4, md: 8 }}>
        <VStack spacing={{ base: 6, md: 8 }} align="center" mb={{ base: 12, md: 16 }}>
          <Heading
            size={{ base: "xl", md: "2xl" }}
            bgGradient="linear(to-r, purple.500, pink.500)"
            bgClip="text"
            textAlign="center"
            px={2}
          >
            ⚀⚅ Random Assignment Made Fun!
          </Heading>
          <Text 
            fontSize={{ base: "md", md: "xl" }} 
            textAlign="center" 
            maxW="800px" 
            color="gray.600"
            px={2}
          >
            Welcome to Chance - where we turn the challenge of assigning tasks into an exciting game!
            Whether you're dividing household chores, selecting secret santa pairs, or randomly assigning any tasks,
            we make it fair and fun with our animated lottery wheel.
          </Text>
          <Button
            as={RouterLink}
            to="/create"
            size={{ base: "md", md: "lg" }}
            colorScheme="purple"
            leftIcon={<FaDice />}
            w={{ base: "full", md: "auto" }}
          >
            Create New Lottery
          </Button>
        </VStack>

        <SimpleGrid 
          columns={{ base: 1, md: 2, lg: 4 }} 
          spacing={{ base: 4, md: 8 }}
          px={{ base: 2, md: 0 }}
        >
          <Feature
            icon={FaUsers}
            title="Fair Distribution"
            description="Ensure everyone gets their fair share through our random assignment system. Perfect for groups of 2 or more!"
          />
          <Feature
            icon={FaTrophy}
            title="Engaging Experience"
            description="Watch our animated wheel spin and build excitement as it selects the winner. Complete with celebration effects!"
          />
          <Feature
            icon={FaRandom}
            title="Multiple Modes"
            description="Choose between single task assignment, multiple tasks, or participant matching mode for different scenarios."
          />
          <Feature
            icon={FaLaugh}
            title="Fun & Social"
            description="Transform task assignment into an engaging group activity. No more arguments about who does what!"
          />
        </SimpleGrid>
      </Container>
    </Box>
  )
}

export default Home 