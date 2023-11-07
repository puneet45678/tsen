from actions import device_registration_actions


def trigger_registring_device(device_id, registration_token):
    device_registration_action = (
        device_registration_actions.register_device(
            device_id, registration_token
        )
    )
    return device_registration_action
