import {
  Body,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components"
import * as React from "react"

export const ParticipantsEmail = ({
  subject,
  content,
}: {
  subject: string
  content: string
}) => (
  <Html>
    <Head />
    {/* <Preview>
      A fine-grained personal access token has been added to your account
    </Preview> */}
    <Body style={main}>
      <Container style={container}>
        <Text style={title}>{subject}</Text>

        <Section style={section}>
          <Text style={text}>{content}</Text>
        </Section>
        <Text style={links}>
          <Link style={link}>Contact support</Link>
        </Text>

        <Text style={footer}>
          From Ethical Digital Nation Collaborative Web App · School of Computer
          Science · University of St Andrews
        </Text>
      </Container>
    </Body>
  </Html>
)

export default ParticipantsEmail

const main = {
  backgroundColor: "#ffffff",
  color: "#24292e",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
}

const container = {
  maxWidth: "480px",
  margin: "0 auto",
  padding: "20px 0 48px",
}

const title = {
  fontSize: "24px",
  lineHeight: 1.25,
}

const section = {
  padding: "24px",
  border: "solid 1px #dedede",
  borderRadius: "5px",
  textAlign: "center" as const,
}

const text = {
  margin: "0 0 10px 0",
  textAlign: "left" as const,
}

const links = {
  textAlign: "center" as const,
}

const link = {
  color: "#0366d6",
  fontSize: "12px",
}

const footer = {
  color: "#6a737d",
  fontSize: "12px",
  textAlign: "center" as const,
  marginTop: "60px",
}
