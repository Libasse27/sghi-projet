export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export class PaginationUtils {
  /**
   * Default values
   */
  private static readonly DEFAULT_PAGE = 1;
  private static readonly DEFAULT_LIMIT = 10;
  private static readonly MAX_LIMIT = 100;

  /**
   * Validate and normalize pagination parameters
   */
  static validateParams(params: PaginationParams): Required<PaginationParams> {
    const page = Math.max(1, params.page || this.DEFAULT_PAGE);
    const limit = Math.min(
      this.MAX_LIMIT,
      Math.max(1, params.limit || this.DEFAULT_LIMIT),
    );
    const sortBy = params.sortBy || 'dateCreation';
    const sortOrder = params.sortOrder?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    return { page, limit, sortBy, sortOrder };
  }

  /**
   * Calculate skip/offset value for database queries
   */
  static calculateSkip(page: number, limit: number): number {
    return (page - 1) * limit;
  }

  /**
   * Calculate total pages
   */
  static calculateTotalPages(totalItems: number, limit: number): number {
    return Math.ceil(totalItems / limit);
  }

  /**
   * Create paginated result object
   */
  static createPaginatedResult<T>(
    data: T[],
    totalItems: number,
    page: number,
    limit: number,
  ): PaginatedResult<T> {
    const totalPages = this.calculateTotalPages(totalItems, limit);

    return {
      data,
      pagination: {
        currentPage: page,
        pageSize: limit,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  /**
   * Extract pagination parameters from query object
   */
  static extractParams(query: any): PaginationParams {
    return {
      page: query.page ? parseInt(query.page, 10) : undefined,
      limit: query.limit ? parseInt(query.limit, 10) : undefined,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    };
  }

  /**
   * Generate pagination metadata for headers
   */
  static generateHeaders(
    totalItems: number,
    page: number,
    limit: number,
  ): Record<string, string> {
    const totalPages = this.calculateTotalPages(totalItems, limit);

    return {
      'X-Total-Count': totalItems.toString(),
      'X-Total-Pages': totalPages.toString(),
      'X-Current-Page': page.toString(),
      'X-Page-Size': limit.toString(),
      'X-Has-Next-Page': (page < totalPages).toString(),
      'X-Has-Previous-Page': (page > 1).toString(),
    };
  }

  /**
   * Generate links for pagination (for Link header)
   */
  static generateLinks(
    baseUrl: string,
    totalItems: number,
    page: number,
    limit: number,
  ): string {
    const totalPages = this.calculateTotalPages(totalItems, limit);
    const links: string[] = [];

    // First page
    links.push(`<${baseUrl}?page=1&limit=${limit}>; rel="first"`);

    // Previous page
    if (page > 1) {
      links.push(`<${baseUrl}?page=${page - 1}&limit=${limit}>; rel="prev"`);
    }

    // Next page
    if (page < totalPages) {
      links.push(`<${baseUrl}?page=${page + 1}&limit=${limit}>; rel="next"`);
    }

    // Last page
    links.push(`<${baseUrl}?page=${totalPages}&limit=${limit}>; rel="last"`);

    return links.join(', ');
  }

  /**
   * Create TypeORM pagination options
   */
  static createTypeOrmOptions(params: PaginationParams) {
    const validated = this.validateParams(params);

    return {
      skip: this.calculateSkip(validated.page, validated.limit),
      take: validated.limit,
      order: {
        [validated.sortBy]: validated.sortOrder,
      },
    };
  }

  /**
   * Create MongoDB pagination options
   */
  static createMongoOptions(params: PaginationParams) {
    const validated = this.validateParams(params);

    return {
      skip: this.calculateSkip(validated.page, validated.limit),
      limit: validated.limit,
      sort: {
        [validated.sortBy]: validated.sortOrder === 'ASC' ? 1 : -1,
      },
    };
  }

  /**
   * Calculate range text (e.g., "1-10 of 100")
   */
  static getRangeText(page: number, limit: number, totalItems: number): string {
    if (totalItems === 0) {
      return '0-0 of 0';
    }

    const start = (page - 1) * limit + 1;
    const end = Math.min(page * limit, totalItems);

    return `${start}-${end} of ${totalItems}`;
  }

  /**
   * Check if page is valid
   */
  static isValidPage(page: number, totalItems: number, limit: number): boolean {
    const totalPages = this.calculateTotalPages(totalItems, limit);
    return page >= 1 && page <= totalPages;
  }

  /**
   * Get page numbers for pagination UI
   */
  static getPageNumbers(currentPage: number, totalPages: number, maxVisible: number = 5): number[] {
    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const half = Math.floor(maxVisible / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxVisible - 1);

    // Adjust start if we're near the end
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }
}
