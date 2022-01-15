/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useRef, useState } from 'react'
import Head from 'next/head'
import { ethers } from 'ethers'
import { Button, Flex, Text, useColorMode, IconButton, Icon, Link, Spinner, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, Input, ModalFooter, useDisclosure } from '@chakra-ui/react'
import WavePortal from '../utils/WavePortal.json'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import { FaLinkedin, FaGithub } from 'react-icons/fa'

export default function Home () {
  const { colorMode, toggleColorMode } = useColorMode()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const initialRef = useRef()
  const finalRef = useRef()

  const [currentAccount, setCurrentAccount] = useState('') // Almacenamos la billetera pública de nuestro usuario.
  const [loader, setLoader] = useState(false) // Estado de carga
  const [total, setTotal] = useState(null) // Total de waves minadas
  const [allWaves, setAllWaves] = useState([]) // Todas las waves
  const [value, setValue] = useState(null) // Valor del input

  // Nuestra direccion del contrato que desplegamos.
  const contractAddress = '0x4A04696010DE8C6007d14846e06FddE76C73c290'
  // Nuestro abi del contrato
  const contractABI = WavePortal.abi
  // random avatares
  const avatars = ['🐵', '🐶', '🐺', '🐱', '🦁', '🐯', '🦒', '🦊', '🦝', '🐮', '🐷', '🐗', '🐭', '🐹', '🐰', '🐻', '🐨', '🐼', '🐸', '🦓', '🐴', '🦄', '🐔', '🐲']

  const getRandomAvatar = () => {
    let avatar = Math.random() * (24 - 1) + 1
    avatar = Math.round(avatar)
    return avatars[avatar]
  }

  const handleInputValue = event => {
    setValue(event.target.value)
  }

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window
      // Nos aseguramos de tener acceso a window.ethereum
      if (!ethereum) {
        console.log('Make sure you have metamask!')
        return
      } else {
        console.log('We have the ethereum object', ethereum)
      }

      // Comprobamos si estamos autorizados a acceder a la billetera del usuario
      const accounts = await ethereum.request({ method: 'eth_accounts' })

      if (accounts.length !== 0) {
        const account = accounts[0]
        console.log('Found an authorized account:', account)
        setCurrentAccount(account)
      } else {
        console.log('No authorized account found')
      }
    } catch (error) {
      console.log(new Error(error))
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window
      if (!ethereum) {
        alert('Get MetaMask!')
        return
      }
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
      console.log('Connected', accounts[0])
      setCurrentAccount(accounts[0])
    } catch (error) {
      console.log(new Error(error))
    }
  }

  // Obtengo todas las waves
  const getAllWaves = async () => {
    try {
      const { ethereum } = window
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer)
        const waves = await wavePortalContract.getAllWaves()
        const wavesCleaned = []
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          })
        })
        setAllWaves(wavesCleaned)
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(new Error(error))
    }
  }

  // Obtengo el total de waves
  const getWaves = async () => {
    try {
      const { ethereum } = window
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer)
        const count = await wavePortalContract.getTotalWaves()
        console.log('Retrieved total wave count...', count.toNumber())
        setTotal(count.toNumber())
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(new Error(error))
    }
  }

  const wave = async () => {
    try {
      const { ethereum } = window
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer)

        let count = await wavePortalContract.getTotalWaves()
        console.log('Retrieved total wave count...', count.toNumber())
        setTotal(count.toNumber())

        // Ejecute la wave real de su contrato inteligente
        const waveTxn = await wavePortalContract.wave(value)
        console.log('Mining...', waveTxn.hash)
        setLoader(true)

        await waveTxn.wait()
        console.log('Mined -- ', waveTxn.hash)
        setLoader(false)

        count = await wavePortalContract.getTotalWaves()
        console.log('Retrieved total wave count...', count.toNumber())
        setTotal(count.toNumber())
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(new Error(error))
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected()
    getWaves()
  }, [])

  useEffect(() => {
    getAllWaves()
  }, [total])

  return (
    <Flex
      align={'center'}
      justify={'space-around'}
      direction={'column'}
      w={'100%'}
      minH={'100vh'}
      py={100}
    >
      <Head>
        <title>buildsapce-wave-ui</title>
        <meta name="description" content="buildspace-wave-ui with Next.js" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Flex
        align={'center'}
        justify={'center'}
        direction={'column'}
        w={'50%'}
      >
        <Text
          as='h1'
          fontSize={'3xl'}
          fontWeight={900}
          letterSpacing={'1px'}
        >
          {"Hi 👋, I'm Braian and"}
        </Text>
        <Text
          as='h3'
          my={10}
          fontSize={'5xl'}
          fontWeight={600}
          letterSpacing={'.5px'}
        >
          Welcome to Wave Portal 🦄
        </Text>

        {/* Enviar una wave */}
        <Button
          mt={5}
          p={4}
          w={'30%'}
          fontWeight={'bold'}
          letterSpacing={1}
          borderRadius={'md'}
          bgGradient={'linear(to-r, pink.300, pink.500)'}
          color={'white'}
          boxShadow={'2xl'}
          _hover={{
            opacity: currentAccount ? '.9' : '.2',
            cursor: currentAccount ? 'pointer' : 'not-allowed'
          }}
          onClick={onOpen}
          disabled={!currentAccount || loader}
        >
          Wave at Me
        </Button>

        {/* Conectar billetera */}
        {!currentAccount && (
          <Button
            mt={10}
            w={'30%'}
            letterSpacing={1}
            borderRadius={'md'}
            bg={'gray.600'}
            color={'white'}
            boxShadow={'2xl'}
            _hover={{
              opacity: '.9',
              cursor: 'pointer'
            }}
            onClick={connectWallet}
            disabled={currentAccount}
          >
            {'Connect your Wallet'}
          </Button>
        )}
      </Flex>

      {/* Contenido */}
      <Flex
        direction={'column'}
        align={'center'}
        justify={'center'}
        w={'50%'}
      >
        {loader
          ? (
          <Flex
            direction={'column'}
            align={'center'}
            justify={'center'}
            w={'100%'}
          >
            <Spinner
              thickness='6px'
              speed='0.45s'
              emptyColor='pink.100'
              color='pink.500'
              size='xl'
            />
            <Text
              mt={2.5}
            >{'Mining'}</Text>
          </Flex>
            )
          : (
              total && (
            <>
              <Flex
                direction={'column'}
                align={'center'}
                justify={'center'}
                w={'100%'}
                py={25}
              >
                <Text
                  fontSize={'2xl'}
                  fontStyle={'italic'}
                  bgGradient={'linear(to-r, pink.300, pink.500)'}
                  bgClip='text'
                >
                  Total waves {total}
                </Text>
              </Flex>

              {allWaves && allWaves.map(wave => (
                <Flex
                  key={wave.timestamp.toString()}
                  mt={5}
                  p={2.5}
                  direction={'column'}
                  align={'flex-start'}
                  justify={'center'}
                  width={'100%'}
                  borderWidth={4}
                  borderColor={'pink.300'}
                  borderRadius={'md'}
                >
                  <Text
                    fontWeight={'bold'}
                    fontSize={'initial'}
                  >
                    {getRandomAvatar()} {wave.address}
                  </Text>
                  <Text
                    fontSize={'10px'}
                    mb={1}
                    color={'gray.500'}
                  >
                    {wave.timestamp.toString()}
                  </Text>
                  <Text
                    fontSize={'2xl'}
                  >
                    {'> '} {wave.message}
                  </Text>
                </Flex>
              ))}
            </>
              )
            )}
      </Flex>

      {/* modal */}
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>🦄 Hey you!</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Wave at me!</FormLabel>
              <Input
                focusBorderColor='pink.300'
                ref={initialRef}
                placeholder='...'
                onChange={handleInputValue}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              borderRadius={'md'}
              bgGradient={'linear(to-r, pink.300, pink.500)'}
              color={'white'}
              mr={3}
              _hover={{
                opacity: value ? '.9' : '.2',
                cursor: value ? 'pointer' : 'not-allowed'
              }}
              onClick={() => {
                wave()
                onClose()
              }}
              disabled={value === null}
            >
              Send
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Footer con links */}
      <Flex
        direction={'row'}
        justify={'center'}
        align={'center'}
        w={'50%'}
        mt={100}
      >
        <IconButton
          mx={5}
          _hover={{
            cursor: 'pointer',
            color: 'pink.100'
          }}
          as={Link}
          href={'https://www.linkedin.com/in/braianvaylet/'}
          icon={<Icon as={FaLinkedin} w={7} h={7} />}

        />
        <IconButton
          mx={5}
          _hover={{
            cursor: 'pointer',
            color: 'pink.100'
          }}
          as={Link}
          href={'https://github.com/BraianVaylet'}
          icon={<Icon as={FaGithub} w={7} h={7} />}
        />
        <IconButton
          mx={5}
          _hover={{
            cursor: 'pointer',
            color: 'pink.100'
          }}
          onClick={toggleColorMode}
          icon={
            colorMode === 'light'
              ? <MoonIcon w={5} h={5} />
              : <SunIcon w={5} h={5} />
          }
        />
      </Flex>
    </Flex>
  )
}
