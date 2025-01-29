import { Box, Flex, Heading, Button, useColorModeValue } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { FaDice } from 'react-icons/fa'

const Header = () => {
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  return (
    <Box
      as="header"
      position="fixed"
      top={0}
      width="100%"
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
      zIndex={10}
      px={4}
      py={2}
    >
      <Flex maxW="1200px" mx="auto" align="center" justify="space-between">
        <Flex align="center">
          <FaDice size={24} color="#805AD5" />
          <Heading as={RouterLink} to="/" size="lg" ml={2} color="purple.500">
            Chance
          </Heading>
        </Flex>
        <Flex gap={4}>
          <Button
            as={RouterLink}
            to="/"
            variant="ghost"
            colorScheme="purple"
          >
            Home
          </Button>
          <Button
            as={RouterLink}
            to="/create"
            colorScheme="purple"
          >
            Create Lottery
          </Button>
        </Flex>
      </Flex>
    </Box>
  )
}

export default Header 