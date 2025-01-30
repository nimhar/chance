import { Box, Container, Heading, HStack, Button } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

const Header = () => {
  const navigate = useNavigate()

  return (
    <Box bg="white" boxShadow="sm" position="fixed" width="100%" top={0} zIndex={10}>
      <Container maxW="800px" py={4}>
        <HStack spacing={8} justify="center" align="center">
          <Heading 
            size="lg" 
            bgGradient="linear(to-r, purple.500, pink.500)" 
            bgClip="text"
            cursor="pointer"
            onClick={() => navigate('/')}
          >
            🎲 Chance
          </Heading>
          <HStack spacing={4}>
            <Button
              variant="ghost"
              colorScheme="purple"
              onClick={() => navigate('/')}
            >
              Home
            </Button>
            <Button
              variant="ghost"
              colorScheme="purple"
              onClick={() => navigate('/create')}
            >
              Create Lottery
            </Button>
          </HStack>
        </HStack>
      </Container>
    </Box>
  )
}

export default Header 