import { Box, Container, Heading, Text, Button, SimpleGrid, Icon, VStack, useColorModeValue } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { FaDice, FaUsers, FaTrophy, FaLaugh } from 'react-icons/fa'

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
      p={6}
      bg={bgColor}
      borderRadius="lg"
      border="1px"
      borderColor={borderColor}
      spacing={4}
      align="start"
      transition="transform 0.2s"
      _hover={{ transform: 'translateY(-4px)' }}
    >
      <Icon as={icon} boxSize={10} color="purple.500" />
      <Heading size="md">{title}</Heading>
      <Text color="gray.600">{description}</Text>
    </VStack>
  )
}

const Home = () => {
  return (
    <Box pt="80px">
      <Container maxW="1200px" py={16}>
        <VStack spacing={8} align="center" mb={16}>
          <Heading
            size="2xl"
            bgGradient="linear(to-r, purple.500, pink.500)"
            bgClip="text"
            textAlign="center"
          >
            Make Chores Fun with Random Assignments
          </Heading>
          <Text fontSize="xl" textAlign="center" maxW="800px" color="gray.600">
            Transform boring household tasks into an exciting game of chance.
            Create fair and random assignments for chores, tasks, or any group activities!
          </Text>
          <Button
            as={RouterLink}
            to="/create"
            size="lg"
            colorScheme="purple"
            leftIcon={<FaDice />}
          >
            Create New Lottery
          </Button>
        </VStack>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
          <Feature
            icon={FaUsers}
            title="Fair Distribution"
            description="Ensure everyone gets their fair share of responsibilities through random assignment."
          />
          <Feature
            icon={FaTrophy}
            title="Gamified Experience"
            description="Turn mundane tasks into an engaging experience with our animated lottery system."
          />
          <Feature
            icon={FaLaugh}
            title="Fun & Social"
            description="Make chore assignment a fun group activity and eliminate arguments about task distribution."
          />
        </SimpleGrid>
      </Container>
    </Box>
  )
}

export default Home 