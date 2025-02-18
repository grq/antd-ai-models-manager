import React, { useState, useRef } from 'react'
import { Button, Spin, message, Typography } from 'antd'
import { apiTranscribe } from '../../api'

export interface VoiceRecorderProps {
  onChange?: (recognizedText: string) => void
  showTranscript?: boolean
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = (props) => {
  const [isRecording, setIsRecording] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [transcript, setTranscript] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  const toggleRecording = async () => {
    if (isRecording) {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop()
        setIsRecording(false)
      }
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 48000,
          sampleSize: 16,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: false,
        },
      })

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
        audioBitsPerSecond: 128000,
      })

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        audioChunksRef.current = []
        await uploadAudio(audioBlob)
      }

      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      message.error('Failed to start recording. Check microphone permissions')
      console.error(error)
    }
  }

  const uploadAudio = async (audioBlob: Blob) => {
    setIsUploading(true)

    try {
      const response = await apiTranscribe(audioBlob)
      const data = await response.json()
      setTranscript(data.transcript)
      console.log(data)
      message.success('Transcription completed successfully')

      if (props.onChange) {
        props.onChange(data.transcript)
      }
    } catch (error) {
      message.error('Transcription failed')
      console.error(error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div style={{ textAlign: 'center', padding: '24px' }}>
      <div style={{ marginTop: '16px' }}>
        <Button
          type="primary"
          onClick={toggleRecording}
          disabled={isUploading}
          className={`text-white ${isRecording ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-500 hover:bg-blue-600'} border-none`}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </Button>
      </div>
      {isUploading && (
        <div style={{ marginTop: '24px' }}>
          <Spin size="large" />
        </div>
      )}
      {(props.showTranscript ?? false) && transcript && (
        <div style={{ marginTop: '24px' }}>
          <Typography.Paragraph>{transcript}</Typography.Paragraph>
        </div>
      )}
    </div>
  )
}

export default VoiceRecorder