import { Flex, Text } from '@chakra-ui/react'
import Head from 'next/head'

export default function Home() {
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
          {"Hi 👋, I'm Braian"}
        </Text>
        <Text
          as='h3'
          fontSize={'2xl'}
          fontWeight={600}
          letterSpacing={'1px'}
        >
          and this is my first project in buildspace 🦄...
        </Text>
      </Flex>
    </Flex>
  )
}
