import { useEffect, useState } from 'react';
import Head from 'next/head'
import { ethers } from "ethers"
import { Button, Flex, Text, useColorMode, IconButton, Icon, Link, Spinner } from '@chakra-ui/react'
import WavePortal from '../utils/WavePortal.json'
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { FaLinkedin } from 'react-icons/fa'
import { FaGithub } from 'react-icons/fa'

export default function Home() {  
  const { colorMode, toggleColorMode } = useColorMode()
  // Almacenamos la billetera pública de nuestro usuario.
  const [currentAccount, setCurrentAccount] = useState("");
  // Estado de carga
  const [loader, setLoader] = useState(false);
  // Total de waves minadas
  const [total, setTotal] = useState(null)
  // Nuestra direccion del contrato que desplegamos.
  const contractAddress = "0x84dC25d181313BA7BF65A23155E15CBb5214f5a1";
  // Nuestro abi del contrato
  const contractABI = WavePortal.abi

  const checkIfWalletIsConnected = async () => {
    try {
      // Nos aseguramos de tener acceso a window.ethereum
      const { ethereum } = window;
      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }
    
      // Comprobamos si estamos autorizados a acceder a la billetera del usuario
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account)
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(new Error(error))
    }
  }

  const connectWallet = async () => {
    try {
        
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }  
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });  
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(new Error(error))
    }
  }

  // Obtengo el total de waves
  const getWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
        setTotal(count.toNumber())
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(new Error(error))
    }
  }

  const wave = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
        setTotal(count.toNumber())

        // Ejecute la wave real de su contrato inteligente
        const waveTxn = await wavePortalContract.wave();
        console.log("Mining...", waveTxn.hash);
        setLoader(true)

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);
        setLoader(false)

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
        setTotal(count.toNumber())
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(new Error(error))
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
    getWaves()
  }, [])

  return (
    <Flex
      align={'center'}
      justify={'space-around'}
      direction={'column'}
      w={'100%'}
      h={'100vh'}
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
          onClick={wave}
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
        {loader ? (
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
        ) : (
          total && (
            <Flex
              direction={'column'}
              align={'center'}
              justify={'center'}
              w={'100%'}
            >
              <Text fontSize={'2xl'}>Total waves</Text>
              <Text fontSize={100}>{total}</Text>
            </Flex>
          )
        )}
      </Flex>

      <Flex
        direction={'row'}
        justify={'center'}
        align={'center'}
        w={'50%'}
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
