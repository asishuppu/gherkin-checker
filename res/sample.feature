Feature: Login Action

Scenario: Successful Login with Valid Credentials
	Given User is on Home Page
	When User Navigate to LogIn Page
	And User enters UserName and Password
	Then Message displayed Login Successfully

Scenario Outline: As a User
    Given User is on Home Page
    When User LogOut from the Application
    And Home Page Loaded
	Then Message displayed LogOut Successfully 