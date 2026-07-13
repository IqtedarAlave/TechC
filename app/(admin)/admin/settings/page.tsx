import SettingsForm from "./SettingsForm";

export default async function AdminSettingsPage() {
  const securityStatus = {
    hasAnthropicKey: !!process.env.ANTHROPIC_API_KEY,
    hasOpenRouterKey: !!process.env.OPENROUTER_API_KEY,
  };

  return <SettingsForm securityStatus={securityStatus} />;
}
