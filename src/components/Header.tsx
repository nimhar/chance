import { Box, Container, Heading, HStack, Button, Show, IconButton, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { HamburgerIcon } from '@chakra-ui/icons'

const Header = () => {
  const navigate = useNavigate()

  return (
    <Box bg="white" boxShadow="sm" position="fixed" width="100%" top={0} zIndex={10}>
      <Container maxW={{ base: "100%", md: "800px" }} py={4} px={{ base: 4, md: 8 }}>
        <HStack spacing={8} justify="space-between" align="center">
          <Heading 
            size={{ base: "md", md: "lg" }}
            bgGradient="linear(to-r, purple.500, pink.500)" 
            bgClip="text"
            cursor="pointer"
            onClick={() => navigate('/')}
            whiteSpace="nowrap"
          >
            ⚀⚅ Chance
          </Heading>

          {/* Desktop Navigation */}
          <Show above="md">
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
          </Show>

          {/* Mobile Navigation */}
          <Show below="md">
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="Options"
                icon={<HamburgerIcon />}
                variant="ghost"
                colorScheme="purple"
              />
              <MenuList>
                <MenuItem onClick={() => navigate('/')}>
                  Home
                </MenuItem>
                <MenuItem onClick={() => navigate('/create')}>
                  Create Lottery
                </MenuItem>
              </MenuList>
            </Menu>
          </Show>
        </HStack>
      </Container>
    </Box>
  )
}

export default Header 