// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.5.0 <0.6.0;

import "./_safemath.sol";

contract CrowdFunding{
    using SafeMath for uint256;

    enum State {
        Fundraising,
        Expired,
        Successful
    }

    event newProject(uint projectId, uint goalAmount, string title, string description, address owner);
    event FundingReceived(address from, uint amount, uint currentTotal);
    event OwnerPaid(address to);

    struct Project{
        uint deadline;
        uint goalAmount;
        uint currentBalance;
        string title;
        string description;
        string url;
    }

    struct Contribution{
        uint projectId;
        uint amountContributed;
        address contributor;
    }

    Project[] public projects;
    Contribution[] public contributions;

    mapping (uint => address payable) public projectToOwner;
    mapping (uint => State) public projectToState;

    modifier inState(uint _id, State _state) {
        require(projectToState[_id] == _state);
        _;
    }

    // modifier isOwner(uint _id) {
    //     require(msg.sender == projectToOwner[_id]);
    //     _;
    // }

    modifier isNotOwner(uint _id) {
        require(msg.sender != projectToOwner[_id]);
        _;
    }

    function getProjectsCount() public view returns (uint) {
        return projects.length;
    }

    function createProject(uint _deadline, uint _goalAmount, string memory _title, string memory _desc, string memory _url) public {
        uint raiseUntil = now + (_deadline * 1 days);
        uint id = projects.push(Project(raiseUntil, (_goalAmount*(10**18)), 0, _title, _desc, _url)) - 1;
        projectToOwner[id] = msg.sender;
        projectToState[id] = State.Fundraising;
        emit newProject(id, _goalAmount, _title, _desc, msg.sender);
    }

    function contribute(uint _id) external inState(_id, State.Fundraising) isNotOwner(_id) payable{
        contributions.push(Contribution(_id, msg.value, msg.sender));
        projects[_id].currentBalance =  projects[_id].currentBalance.add(msg.value);
        emit FundingReceived(msg.sender, msg.value, projects[_id].currentBalance);
        checkFundingStatus(_id);
    }

    function withdraw(uint _id) internal inState(_id, State.Successful) returns (bool){
        if(projectToOwner[_id].send(projects[_id].currentBalance)){
            emit OwnerPaid(projectToOwner[_id]);
            projects[_id].currentBalance = 0;
            return true;
        } 
        return false;
    } 

    function getRefund(uint _id) public inState(_id, State.Expired) returns (bool){
        uint amountToRefund = 0;
        for(uint i = 0; i < contributions.length; i++){
            if(contributions[i].projectId == _id && contributions[i].contributor == msg.sender){
                if(contributions[i].amountContributed > 0){
                    amountToRefund = amountToRefund.add(contributions[i].amountContributed);
                    contributions[i].amountContributed = 0;
                }
            }
        }
        if(msg.sender.send(amountToRefund)){
            projects[_id].currentBalance = projects[_id].currentBalance.sub(amountToRefund);
            return true;
        }
        return false;
    }

    function checkFundingStatus(uint _id) public {
        if(projects[_id].currentBalance >= projects[_id].goalAmount){
            projectToState[_id] = State.Successful;
            withdraw(_id);
        } else if (now > projects[_id].deadline){
            projectToState[_id] = State.Expired;
        }
    }
}