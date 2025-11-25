import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from '../entities/invoice.entity';

interface InsuranceClaim {
  invoiceId: string;
  insuranceCompany: string;
  policyNumber: string;
  claimAmount: number;
  servicesCovered: string[];
}

interface ClaimResponse {
  success: boolean;
  claimId?: string;
  approvedAmount?: number;
  deniedAmount?: number;
  status?: string;
  message?: string;
}

@Injectable()
export class InsuranceService {
  // Common insurance companies in Senegal
  private readonly insuranceCompanies = [
    'ALLIANZ',
    'AXA',
    'AMSA',
    'SONAM',
    'SALAMA',
    'ASKIA',
    'SUNU',
    'CNIA',
    'NSIA',
    'UAM',
  ];

  // Coverage rates by service type (example rates)
  private readonly coverageRates = {
    CONSULTATION: 0.7, // 70% coverage
    SURGERY: 0.8, // 80% coverage
    HOSPITALIZATION: 0.75, // 75% coverage
    PHARMACY: 0.6, // 60% coverage
    LABORATORY: 0.65, // 65% coverage
    IMAGING: 0.7, // 70% coverage
    PHYSIOTHERAPY: 0.5, // 50% coverage
    EMERGENCY: 0.9, // 90% coverage
  };

  constructor(
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
  ) {}

  async submitClaim(claim: InsuranceClaim): Promise<ClaimResponse> {
    try {
      // Validate insurance company
      if (!this.insuranceCompanies.includes(claim.insuranceCompany)) {
        throw new BadRequestException('Invalid insurance company');
      }

      // Get invoice
      const invoice = await this.invoiceRepository.findOne({
        where: { id: claim.invoiceId },
      });

      if (!invoice) {
        throw new NotFoundException('Invoice not found');
      }

      // In production, this would make an actual API call to insurance provider
      // For now, we'll simulate the claim submission
      const response = await this.simulateClaimSubmission(claim, invoice);

      if (response.success) {
        // Update invoice with insurance information
        invoice.insuranceCompany = claim.insuranceCompany;
        invoice.insurancePolicyNumber = claim.policyNumber;
        invoice.insuranceCoverage = response.approvedAmount;
        invoice.patientResponsibility = invoice.totalAmount - response.approvedAmount;

        await this.invoiceRepository.save(invoice);
      }

      return response;
    } catch (error) {
      throw new BadRequestException(`Insurance claim submission failed: ${error.message}`);
    }
  }

  async checkClaimStatus(claimId: string): Promise<ClaimResponse> {
    // In production, this would query insurance provider API
    // For now, we'll return a simulated response
    return {
      success: true,
      claimId,
      status: 'APPROVED',
      approvedAmount: 50000,
      deniedAmount: 0,
      message: 'Claim approved and processed',
    };
  }

  async calculateCoverage(invoiceType: string, totalAmount: number, insuranceCompany: string): Promise<number> {
    const coverageRate = this.coverageRates[invoiceType] || 0.5;

    // Some insurance companies might have different rates
    // In production, this would fetch actual rates from a database or insurance API
    let adjustedRate = coverageRate;

    // Premium insurance companies might offer better rates
    if (['ALLIANZ', 'AXA'].includes(insuranceCompany)) {
      adjustedRate = Math.min(coverageRate + 0.1, 1.0); // +10% coverage, max 100%
    }

    return totalAmount * adjustedRate;
  }

  async verifyInsurance(policyNumber: string, insuranceCompany: string): Promise<boolean> {
    // In production, this would verify the policy with the insurance provider
    // For now, we'll simulate verification
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Simulate 90% verification success rate
    return Math.random() > 0.1;
  }

  async getPreAuthorization(request: {
    patientId: string;
    policyNumber: string;
    insuranceCompany: string;
    serviceType: string;
    estimatedAmount: number;
  }): Promise<ClaimResponse> {
    try {
      // Verify insurance first
      const isValid = await this.verifyInsurance(request.policyNumber, request.insuranceCompany);

      if (!isValid) {
        return {
          success: false,
          message: 'Insurance policy could not be verified',
        };
      }

      // Calculate pre-approved amount
      const approvedAmount = await this.calculateCoverage(
        request.serviceType,
        request.estimatedAmount,
        request.insuranceCompany,
      );

      // In production, this would submit pre-authorization request to insurance provider
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return {
        success: true,
        claimId: `PRE${Date.now()}`,
        approvedAmount,
        deniedAmount: request.estimatedAmount - approvedAmount,
        status: 'PRE_AUTHORIZED',
        message: 'Pre-authorization approved',
      };
    } catch (error) {
      throw new BadRequestException(`Pre-authorization failed: ${error.message}`);
    }
  }

  async getSupportedInsuranceCompanies(): Promise<string[]> {
    return this.insuranceCompanies;
  }

  async getCoverageRates(): Promise<any> {
    return this.coverageRates;
  }

  private async simulateClaimSubmission(claim: InsuranceClaim, invoice: Invoice): Promise<ClaimResponse> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Calculate coverage based on service type
    const coverageRate = this.coverageRates[invoice.type] || 0.5;
    const approvedAmount = Math.round(claim.claimAmount * coverageRate);
    const deniedAmount = claim.claimAmount - approvedAmount;

    // Simulate 85% approval rate
    const isApproved = Math.random() > 0.15;

    if (isApproved) {
      return {
        success: true,
        claimId: `CLM${Date.now()}`,
        approvedAmount,
        deniedAmount,
        status: 'APPROVED',
        message: `Claim approved. ${coverageRate * 100}% coverage applied.`,
      };
    } else {
      return {
        success: false,
        claimId: `CLM${Date.now()}`,
        approvedAmount: 0,
        deniedAmount: claim.claimAmount,
        status: 'DENIED',
        message: 'Claim denied. Service not covered under policy.',
      };
    }
  }

  // Method to handle insurance claim webhooks/callbacks
  async handleClaimUpdate(claimData: any): Promise<void> {
    const { claimId, invoiceId, status, approvedAmount } = claimData;

    if (status === 'APPROVED') {
      const invoice = await this.invoiceRepository.findOne({
        where: { id: invoiceId },
      });

      if (invoice) {
        invoice.insuranceCoverage = approvedAmount;
        invoice.patientResponsibility = invoice.totalAmount - approvedAmount;
        await this.invoiceRepository.save(invoice);
      }
    }
  }
}
