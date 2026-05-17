# Cryptographic NFT Minting Pipeline

This document outlines the end-to-end technical workflow for the automated identity-verification and dynamic Zodiac NFT minting pipeline on the **Base L2 Network** using an **AWS Lambda** backend.

---

## Technical Architecture Overview

The system uses a hybrid architecture designed to minimize blockchain gas costs while ensuring data security and permanent asset decentralized storage:
* **Frontend:** Handles user wallet interaction and Coinbase Wallet verification.
* **On-Chain Attestation:** Uses Ethereum Attestation Service (EAS) to gate the pipeline.
* **AWS Lambda (Backend Engine):** Process heavy assets (image manipulation, data encryption, and IPFS uploading) off-chain for zero gas cost.
* **EIP-1167 Proxy Factory:** Generates ultra-low-cost "clones" of a master royalty split contract per mint.
* **ERC-721 Contract:** Handles the final cryptographic minting and custom royalty routing.

---

## Step-by-Step Workflow Execution

### Phase 1: User Verification & Input
1. **Wallet Connection:** The user lands on the website and connects their **Coinbase Wallet**.
2. **EAS Attestation Check:** The frontend queries the **Ethereum Attestation Service (EAS)** registry.
   * *If Valid:* The user is granted access to the minting portal.
   * *If Invalid/Missing:* Entry is denied, prompting the user to complete verification.
3. **User Data verified against coinbase EAS**

### Phase 2: Serverless Backend Processing (AWS Lambda)
4. **Data Transmission:** The frontend securely sends the User's Name, DOB, and Wallet Address to the AWS Lambda server endpoint.
5. **Processing:** The Python engine calculates the user’s specific attributes and generates dynamic on-chain "Stats" based on their birth metrics.
6. **Data Encryption:** The engine cryptographically hashes and encrypts the Name and DOB to protect PII (Personally Identifiable Information).
7. **Image Burning:** The engine pulls the standard base template PNG from **Amazon S3**, uses an image processing library (e.g., Pillow) to burn the encrypted data hash and a verification mock signature directly onto the image pixels.

### Phase 3: Decentralized Asset Storage
8. **IPFS Upload:** The final burned image file is pushed to IPFS via a pinning service (e.g., Pinata).
9. **Metadata Assembly:** Lambda generates the ERC-721 compliant metadata JSON file containing:
   * The IPFS image URI.
   * The calculated Zodiac traits/stats.
   * The encrypted identity verification hash.
10. **CID Retrieval:** Lambda uploads the JSON to IPFS and retrieves the final Metadata Content Identifier (**CID**).

### Phase 4: Smart Contract Execution & Royalty Split
11. **EIP-1167 Split Deployment:** Before minting, the Lambda function calls the pre-deployed **Clone Factory** contract on Base.
    * It passes the `User Wallet` ($95\%$) and `Developer Wallet` ($5\%$) as variables.
    * The factory spits out a unique, ultra-cheap **Split Clone Address** pointing to the Master Split Blueprint.
12. **Programmatic NFT Mint:** Lambda executes the transaction on the primary ERC-721 contract using `web3.py`, inputting:
    * The target `User Wallet`.
    * The IPFS metadata `tokenURI` (CID).
    * The fresh **Split Clone Address** as the dedicated `royaltyReceiver`.
    * The total collection secondary royalty fee percentage (e.g., $10\%$).

### Phase 5: Delivery
13. **Blockchain Confirmation:** The transaction settles on the Base network (typically within 2 seconds).
14. **Asset Receipt:** The unique Soul NFT instantly appears in the user's connected Coinbase Wallet.

---

## Process Flowchart Reference

```text
[User Connects Wallet]
         │
         ▼
[EAS Attestation Check] ──(Fails)──► [Access Denied]
         │
      (Passes)
         │
         ▼
[User Inputs Name & DOB]
         │
         ▼
 ┌────────────────────────────────────────────────────────┐
 │                   AWS LAMBDA SERVER                    │
 │                                                        │
 │ 1. Pulls Base PNG from S3                              │
 │ 2. Generates Stats & Encrypts PII               │
 │ 3. Burns Cryptographic Signature onto Image            │
 │ 4. Uploads Final Image + Metadata JSON to IPFS         │
 └────────────────────────────────────────────────────────┘
         │
    (Returns CID)
         │
         ▼
[Lambda Calls Clone Factory] ──► Deploys Unique 95% / 5% Split Contract
         │
  (Returns Split Address)
         │
         ▼
[Lambda Calls ERC-721 Contract] ──► Mints NFT with Token Custom Royalty Override
         │
         ▼
[NFT Airddropped to Coinbase Wallet]
