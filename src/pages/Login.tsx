import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { Form, Input, Button, message } from 'antd'
import { loginRequest } from '../api'

const LoginPage = () => {
  const mutation: UseMutationResult<
        { accessToken: string },
        Error,
        { email: string; password: string }
    > = useMutation({
      mutationFn: loginRequest,
      onSuccess: () => {
        message.success('Login successful!')
      },
      onError: (error: Error) => {
        message.error(error.message || 'Login failed. Please try again.')
      },
    })

  const onFinish = (values: { email: string; password: string }) => {
    mutation.mutate(values)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-800">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <img
          src="/logo.png"
          alt="Logo"
          className="w-36 mx-auto mb-6"
        />
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          className="space-y-4"
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input
              placeholder="Email"
              size="large"
              className="rounded-lg"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              placeholder="Password"
              size="large"
              className="rounded-lg"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              // loading={mutation.isLoading} // Show spinner while loading
              className="w-full bg-teal-500 hover:bg-teal-600 text-white py-2 rounded-lg"
              size="large"
            >
                            Log In
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default LoginPage