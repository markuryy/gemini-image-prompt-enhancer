"use client";
import { Box, Title, Stack, Textarea, Button, Paper, Container, Text, Modal, TextInput, Tooltip, Group, ActionIcon, useMantineTheme, Transition } from "@mantine/core";
import { useState, useRef, useEffect } from "react";
import presets from "@/data/presets.json";
import { usePresets } from "@/utils/presetManager";
import { ErrorBoundary } from "react-error-boundary";
import { useApiKey } from "@/utils/apiKeyManager";
import { TbHorse, TbArrowBack, TbSettings, TbChevronDown, TbKey, TbX } from "react-icons/tb";
import { LuSparkles } from "react-icons/lu";
import { useMediaQuery } from '@mantine/hooks';

function ErrorFallback({error}: {error: Error}) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ wordBreak: 'break-word' }}>{error.message}</pre>
    </div>
  )
}

export default function Home() {
  console.log("Rendering Home component");
  const [input, setInput] = useState("");
  const [previousInput, setPreviousInput] = useState("");
  const [clearedInput, setClearedInput] = useState("");
  const { presetNames, selectedPreset, setSelectedPreset } = usePresets();
  const [isEnhancing, setIsEnhancing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [tempApiKey, setTempApiKey] = useState("");
  const { apiKey, saveApiKey, removeApiKey } = useApiKey();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isScore9Active, setIsScore9Active] = useState(false);
  const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);
  const [customPreset, setCustomPreset] = useState("");

  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  useEffect(() => {
    if (!apiKey) {
      setIsApiKeyModalOpen(true);
    } else {
      setIsApiKeyModalOpen(false);
    }
  }, [apiKey]);

  const toggleScore9 = () => {
    setIsScore9Active(!isScore9Active);
    setInput(prev => {
      const score9Text = "score_9, score_8_up, score_7_up, score_6_up, score_5_up, score_4_up, ";
      if (isScore9Active) {
        return prev.replace(score9Text, "");
      } else {
        return score9Text + prev;
      }
    });
  };

  const enhancePrompt = async () => {
    if (!input.trim() || !apiKey) return;
    setIsEnhancing(true);
    setPreviousInput(input);
    setInput("");

    try {
      const response = await fetch('/api/enhance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input,
          selectedPreset: selectedPreset === "Custom" ? customPreset : presets[selectedPreset as keyof typeof presets],
          apiKey,
        }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      setInput(data.enhancedPrompt);
    } catch (error) {
      console.error("Error:", error);
      setInput("Sorry, I encountered an error.");
    } finally {
      setIsEnhancing(false);
    }
  };

  const undoEnhancement = () => {
    setInput(previousInput);
    setPreviousInput("");
  };

  const clearPrompt = () => {
    setClearedInput(input);
    setInput("");
  };

  const undoClear = () => {
    setInput(clearedInput);
    setClearedInput("");
  };

  const handleSaveApiKey = () => {
    saveApiKey(tempApiKey);
    setIsApiKeyModalOpen(false);
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Container size="md" px={isMobile ? 'xs' : 'md'}>
        <Box component="header" h={60} p="xs" style={{ position: 'relative' }}>
          <Group justify="center" style={{ height: '100%' }}>
            <Title order={3} size={isMobile ? 'h4' : 'h3'}>AI Prompt Enhancer</Title>
          </Group>
          <Tooltip label="API Key" position="bottom-end">
            <ActionIcon 
              onClick={() => setIsSettingsOpen(true)} 
              variant="subtle"
              style={{ position: 'absolute', top: '50%', right: '1rem', transform: 'translateY(-50%)' }}
            >
              <TbKey size="1.2rem" />
            </ActionIcon>
          </Tooltip>
        </Box>
        
        <Stack align="stretch" justify="flex-start" h={isMobile ? "auto" : "calc(100vh - 120px)"} fw="md" gap={isMobile ? 'sm' : 'md'}>
          <Group justify="center" align="center" wrap="wrap">
            <Text>Optimize prompt for</Text>
            <Button onClick={() => setIsPresetModalOpen(true)} rightSection={<TbChevronDown />} variant="subtle" size={isMobile ? 'compact-sm' : 'compact-md'}>
              {selectedPreset}
            </Button>
          </Group>
          
          <Paper withBorder p={isMobile ? 'xs' : 'md'} style={{ width: "100%", maxWidth: "1000px", margin: "0 auto" }}>
            <Stack gap={isMobile ? 'xs' : 'md'}>
              <Box style={{ position: 'relative' }}>
                <Textarea
                  ref={textareaRef}
                  placeholder="Your prompt..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  minRows={5}
                  resize="vertical"
                  autosize
                  style={{ width: isMobile ? "100%" : "40vh" }}
                />
                <Transition mounted={input.length > 0} transition="fade" duration={400} timingFunction="ease">
                  {(styles) => (
                    <Tooltip label="Clear prompt" position="left">
                      <ActionIcon
                        style={{
                          ...styles,
                          position: 'absolute',
                          top: '5px',
                          right: '5px',
                          backgroundColor: 'transparent',
                          color: theme.colors.gray[6],
                          opacity: 0.6,
                          transition: 'opacity 0.2s',
                        }}
                        onClick={clearPrompt}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}
                        size="sm"
                      >
                        <TbX size="0.8rem" />
                      </ActionIcon>
                    </Tooltip>
                  )}
                </Transition>
              </Box>
              <Group justify="center" wrap="wrap">
                <Tooltip label="Toggle Score 9">
                  <Button onClick={toggleScore9} variant={isScore9Active ? "filled" : "outline"} size={isMobile ? 'sm' : 'md'}>
                    <TbHorse />
                  </Button>
                </Tooltip>
                <Button onClick={enhancePrompt} loading={isEnhancing} disabled={!apiKey} leftSection={<LuSparkles />} size={isMobile ? 'sm' : 'md'}>
                  Enhance
                </Button>
                <Tooltip label="Undo">
                  <Button 
                    onClick={clearedInput ? undoClear : undoEnhancement} 
                    disabled={!previousInput && !clearedInput} 
                    variant="outline" 
                    size={isMobile ? 'sm' : 'md'}
                  >
                    <TbArrowBack />
                  </Button>
                </Tooltip>
              </Group>
            </Stack>
          </Paper>
        </Stack>
      </Container>

      <Modal opened={isApiKeyModalOpen} onClose={() => {}} title="Enter GROQ API Key" closeOnClickOutside={false} closeOnEscape={false} size={isMobile ? 'sm' : 'md'}>
        <Stack>
          <TextInput
            placeholder="Enter your GROQ API Key"
            value={tempApiKey}
            onChange={(e) => setTempApiKey(e.currentTarget.value)}
          />
          <Button onClick={handleSaveApiKey} disabled={!tempApiKey}>
            Save API Key
          </Button>
          <Text ta="center" size="xs">
            Don't have an API Key? Get one{" "}
            <a style={{ color: "#74C0FC" }} href="https://console.groq.com/keys" target="_blank" rel="noopener noreferrer">here</a>
          </Text>
        </Stack>
      </Modal>

      <Modal opened={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} title="Settings" size={isMobile ? 'sm' : 'md'}>
        <Stack>
          <Button onClick={() => {
            removeApiKey();
            setIsSettingsOpen(false);
            setIsApiKeyModalOpen(true);
          }}>
            Remove API Key
          </Button>
        </Stack>
      </Modal>

      <Modal opened={isPresetModalOpen} onClose={() => setIsPresetModalOpen(false)} title="Select Preset" size={isMobile ? 'sm' : 'md'}>
        <Stack>
          {presetNames.map(key => (
            <Button
              key={key}
              onClick={() => {
                setSelectedPreset(key);
                setIsPresetModalOpen(false);
              }}
              variant={selectedPreset === key ? "filled" : "light"}
              size={isMobile ? 'sm' : 'md'}
            >
              {key}
            </Button>
          ))}
          <Button
            onClick={() => {
              setSelectedPreset("Custom");
            }}
            variant={selectedPreset === "Custom" ? "filled" : "light"}
            size={isMobile ? 'sm' : 'md'}
          >
            Custom
          </Button>
          {selectedPreset === "Custom" && (
            <Textarea
              label="Custom Preset"
              value={customPreset}
              onChange={(e) => setCustomPreset(e.currentTarget.value)}
              minRows={5}
              placeholder="Enter your custom system prompt here..."
            />
          )}
        </Stack>
      </Modal>
    </ErrorBoundary>
  );
}
