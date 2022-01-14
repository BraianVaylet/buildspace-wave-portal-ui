import { useEffect, useState } from 'react';
import Head from 'next/head'
import { ethers } from "ethers"
import { Button, Flex, Text, useColorMode, IconButton, Icon } from '@chakra-ui/react'
import WavePortal from '../utils/WavePortal.json'
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { FaLinkedin } from 'react-icons/fa'
import { FaGithub } from 'react-icons/fa'

export default function Home() {  
  const { colorMode, toggleColorMode } = useColorMode()
  // Almacenamos la billetera pública de nuestro usuario.
  const [currentAccount, setCurrentAccount] = useState("");
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
      console.log(error);
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
      console.log(error)
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

        // Ejecute la wave real de su contrato inteligente
        const waveTxn = await wavePortalContract.wave();
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  return (
    <Flex
      align={'center'}
      justify={'center'}
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

        <Button
          mt={5}
          bg={'pink.300'}
          color={'white'}
          _hover={{
            bg: 'pink.400',
            cursor: 'pointer'
          }}
          onClick={wave}
        >
          Wave at Me
        </Button>
        
        {/* If there is current account then I disable this button */}        
        <Button
          mt={10}
          bg={'black'}
          color={'white'}
          _hover={{
            opacity: '.9',
            cursor: 'pointer'
          }}
          onClick={connectWallet}          
          disabled={currentAccount}
        >
          {currentAccount ? 'You have access 👍' : 'Connect your Wallet'}
        </Button>      
      </Flex>

      <Flex>
        <IconButton 
          icon={<Icon as={FaLinkedin} w={7} h={7} />}          
        />
        <IconButton 
          icon={<Icon as={FaGithub} w={7} h={7} />}
        />
        <IconButton 
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
