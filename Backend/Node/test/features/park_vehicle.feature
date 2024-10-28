Feature: Park a vehicle

    In order to not forget where I've parked my vehicle
    As an application user
    I should be able to indicate my vehicle location

    Background:
        Given Alice's fleet
        And vehicle '6052XAD'
        And Alice has registered vehicle '6052XAD' into her fleet

    @critical
    Scenario: Successfully park a vehicle
        And location 'A': lon=2.24 lat=44.34
        When Alice parks vehicle '6052XAD' at location 'A'
        Then the current location of vehicle '6052XAD' should be location 'A'

    Scenario: Can't localize my vehicle to the same location two times in a row
        And location 'A': lon=2.24 lat=44.34
        And vehicle '6052XAD' has been parked into location 'A'
        When Alice tries to park vehicle '6052XAD' at location 'A'
        Then Alice should be informed that vehicle '6052XAD' is already parked at location 'A'
