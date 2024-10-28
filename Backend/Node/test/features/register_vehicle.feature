Feature: Register a vehicle

    In order to follow many vehicles with my application
    As an application user
    I should be able to register my vehicle

    @critical
    Scenario: A user can register a vehicle
        Given Alice's fleet
        And vehicle '6052XAD'
        When Alice registers vehicle '6052XAD' into her fleet
        Then vehicle '6052XAD' should be part of Alice's vehicle fleet

    Scenario: A user cannot register the same vehicle twice
        Given Alice's fleet
        And vehicle '6052XAD'
        And Alice has registered vehicle '6052XAD' into her fleet
        When Alice tries to register vehicle '6052XAD' into her fleet
        Then Alice should be informed that vehicle '6052XAD' has already been registered into her fleet

    Scenario: A vehicle can belong to more than one fleet
        Given Alice's fleet
        And Bob's fleet 
        And vehicle '6052XAD'
        And Alice has registered vehicle '6052XAD' into her fleet
        When Bob tries to register vehicle '6052XAD' into his fleet
        Then vehicle '6052XAD' should be part of Bob's vehicle fleet
