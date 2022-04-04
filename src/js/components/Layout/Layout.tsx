import { Heading, Button, IconButton, Box, useDisclosure, Collapse, Text, VStack, Divider, HStack } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { XmarkIcon, ChevronUpIcon, LinkedIcon, UnlinkedIcon } from '@/Icons/Icons';
import { withErrorBoundary } from 'react-error-boundary';

const Container = motion(Box)

export const RightSidebarContainer = ({ isOpen, width, isDragging, children }) => {
  return <AnimatePresence initial={false}>
    {isOpen &&
      <Container
        className="right-sidebar"
        display="flex"
        WebkitAppRegion="no-drag"
        flexDirection="column"
        height="calc(100% - 3.25rem)"
        marginTop="3.25rem"
        alignItems="stretch"
        justifySelf="stretch"
        transformOrigin="right"
        justifyContent="space-between"
        overflowX="visible"
        position="relative"
        gridArea="secondary-content"
        sx={{
          "--page-padding-v": "1rem",
          "--page-padding-h": "0rem",
          "--page-title-font-size": "1.25rem",
        }}
        initial={{
          width: 0,
          opacity: 0
        }}
        transition={isDragging ? { duration: 0 } : undefined}
        animate={{
          width: isOpen ? `${width}vw` : 0,
          opacity: 1
        }}
        exit={{
          width: 0,
          opacity: 0
        }}
      >
        {children}
      </Container>}
  </AnimatePresence>
}

export const SidebarItem = ({ title, defaultIsOpen, onRemove, onClose, children }) => {
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: defaultIsOpen, onClose: onClose });

  return (
    <VStack
      align="stretch"
      position="relative"
      spacing={0}
      ml="1px" // Account for the floating separator
      _notFirst={{
        borderTop: "1px solid",
        borderColor: "separator.divider"
      }}>
      <Box
        top="-1px"
        zIndex={2}
        position="sticky"
        background="background.floor"
        display="grid"
        gridTemplateColumns="1fr 3rem"
        pr={2}
        alignItems="center"
        justifyContent="center"
      >
        <Button onClick={onToggle}
          display="flex"
          bg="transparent"
          borderRadius="0"
          gap={2}
          py={3}
          pl={5}
          pr={0}
          height="auto"
          textAlign="left"
          overflow="hidden"
          whiteSpace="nowrap"
          sx={{ maskImage: "linear-gradient(to right, black, black calc(100% - 1rem), transparent calc(100%))" }}
        >
          <ChevronUpIcon transform={isOpen ? "rotate(180deg)" : null}
            justifySelf="center"
          />
          <Box
            flex="1 1 100%"
            tabIndex={-1}
            pointerEvents="none"
            position="relative"
            bottom="1px"
            overflow="hidden"
            color="foreground.secondary"
          >{title}</Box>
        </Button>
        <IconButton
          onClick={onRemove}
          size="sm"
          color="foreground.secondary"
          alignSelf="center"
          justifySelf="center"
          bg="transparent"
          aria-label="Close"
        >
          <XmarkIcon />
        </IconButton>
      </Box>
      <Box
        as={Collapse}
        in={isOpen}
        animateOpacity
        unmountOnExit
        zIndex={1}
        px={4}
      >
        {children}
      </Box>
    </VStack >)
}

export const PageReference = ({ children }) => {
  return (
    <Box>
      {children}
    </Box>
  )
}

interface PageReferences {
  children: React.ReactNode,
  extras: React.ReactNode,
  showIfEmpty: boolean,
  count: number,
  title: string,
  defaultIsOpen: boolean,
  onOpen: () => void,
  onClose: () => void,
}

export const ReferenceHeader = ({ onClick, title }) => {
  return <Heading
    as="h4"
    pl={4}
  >
    <Button
      variant="link"
      onClick={onClick}
      textTransform="uppercase"
      fontWeight="bold"
      fontSize="xs"
      color="foreground.secondary"
      opacity={0.5}
      display="flex"
    >{title}</Button>
  </Heading>
}

export const ReferenceGroup = ({ title, onClickTitle, children }) => {
  return (
    <VStack
      align="stretch"
      spacing={4}
      py={4}
      _notFirst={{
        borderTop: "1px solid",
        borderColor: "separator.divider"
      }}
    >
      {title && <ReferenceHeader onClick={onClickTitle} title={title} />}
      {children}
    </VStack>
  )
}

export const ReferenceBlock = ({ children, actions }) => {
  return <Box
  >{children} {actions}</Box>
}

const EmptyReferencesNotice = ({ title }: { title: string }) => {
  return (<Text
    background="background.floor"
    color="foreground.secondary"
    borderRadius="md"
    p={4}>
    No {title.toLowerCase()}
  </Text>)
}

export const PageReferences = withErrorBoundary(({ children, count, title, defaultIsOpen, onOpen, onClose, extras }: PageReferences) => {

  const { isOpen, onToggle } = useDisclosure({
    defaultIsOpen: defaultIsOpen,
    onClose: onClose,
    onOpen: onOpen
  });

  return (
    <VStack
      align="stretch"
      position="relative"
      spacing={0}
      p={1}
      mt={2}
      borderRadius="md"
      background="background.basement"
    >
      <HStack>
        <Button onClick={onToggle}
          variant="ghost"
          flex="1 1 100%"
          color="foreground.secondary"
          textAlign="left"
          justifyContent="flex-start"
          overflow="hidden"
          whiteSpace="nowrap"
          leftIcon={
            <ChevronUpIcon transform={isOpen ? "rotate(180deg)" : null}
              boxSize={1}
              justifySelf="center"
            />
          }
        >
          {title}
          <Text marginInlineStart={2} minWidth="1.75em" textAlign="center" background="background.basement" borderRadius="full" p={1} fontSize="sm">{count}</Text>
        </Button>
        {extras}
      </HStack>
      <Collapse in={(isOpen && !!children)}>
        <Divider />
        <VStack spacing={0} pl={4} py={2} align="stretch">
          {children}
        </VStack>
      </Collapse>
    </VStack>)
},
  { fallback: <Text>Error displaying references</Text> })