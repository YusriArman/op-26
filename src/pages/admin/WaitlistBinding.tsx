import BindingPage from "../../components/admin/BindingPage";

function WaitlistBinding() {
  return (
    <BindingPage
      title="Waitlist Binding"
      description="Bind students currently in the waitlist."
      type="waitlist"
    />
  );
}

export default WaitlistBinding;