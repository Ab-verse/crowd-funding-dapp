// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

/**
 * @author Abhishek S
 * @title CrowdFunding
 * @dev A contract for managing crowdfunding campaigns.
 */
contract CrowdFunding {
    struct Campaign {
        address owner;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        string image;
        address[] donators;
        uint256[] donations;
    }

    mapping(uint256 => Campaign) public campaigns;
    uint256 public numberOfCampaigns = 0;

    /**
     * @dev Creates a new crowdfunding campaign.
     * @param _owner The address of the campaign owner.
     * @param _title The title of the campaign.
     * @param _description The description of the campaign.
     * @param _target The fundraising target for the campaign.
     * @param _deadline The deadline for the campaign.
     * @param _image The image associated with the campaign.
     * @return The ID of the newly created campaign.
     */
    function createCampaign(address _owner, string memory _title, string memory _description, uint256 _target, uint256 _deadline, string memory _image) public returns (uint256) {
        Campaign storage campaign = campaigns[numberOfCampaigns];

        require(campaign.deadline < block.timestamp, "The deadline should be a date in the future.");

        campaign.owner = _owner;
        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
        campaign.deadline = _deadline;
        campaign.amountCollected = 0;
        campaign.image = _image;

        numberOfCampaigns++;

        return numberOfCampaigns - 1;
    }

    /**
     * @dev Allows a user to donate to a crowdfunding campaign.
     * @param _id The ID of the campaign to donate to.
     */
    function donateToCampaign(uint256 _id) public payable {
        uint256 amount = msg.value;

        Campaign storage campaign = campaigns[_id];

        campaign.donators.push(msg.sender);
        campaign.donations.push(amount);

        (bool sent,) = payable(campaign.owner).call{value: amount}("");

        if(sent) {
            campaign.amountCollected = campaign.amountCollected + amount;
        }
    }

    /**
     * @dev Retrieves the list of donors and their contributions for a campaign.
     * @param _id The ID of the campaign to get donor information for.
     * @return An array of donor addresses and an array of their respective contributions.
     */
    function getDonators(uint256 _id) view public returns (address[] memory, uint256[] memory) {
        return (campaigns[_id].donators, campaigns[_id].donations);
    }

    /**
     * @dev Retrieves information about all the crowdfunding campaigns.
     * @return An array of Campaign structs representing all the campaigns.
     */
    function getCampaigns() public view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](numberOfCampaigns);

        for(uint i = 0; i < numberOfCampaigns; i++) {
            Campaign storage item = campaigns[i];

            allCampaigns[i] = item;
        }

        return allCampaigns;
    }
}
