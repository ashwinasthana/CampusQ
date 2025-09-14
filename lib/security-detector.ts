// Advanced security detection and blocking
export class SecurityDetector {
  // XSS patterns to detect and block - more specific to avoid false positives
  private static XSS_PATTERNS = [
    /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
    /javascript:\s*[^;]/gi, // Avoid matching protocol in URLs
    /on\w+\s*=\s*["'][^"']*javascript:/gi,
    /<iframe[\s\S]*?src\s*=\s*["'][^"']*javascript:/gi,
    /<object[\s\S]*?data\s*=\s*["'][^"']*javascript:/gi,
    /<embed[\s\S]*?src\s*=\s*["'][^"']*javascript:/gi,
    /<link[\s\S]*?href\s*=\s*["'][^"']*javascript:/gi,
    /<meta[\s\S]*?http-equiv\s*=\s*["']refresh["']\s*content\s*=\s*["'][^"']*url\s*=\s*javascript:/gi,
    /expression\s*\(/gi,
    /vbscript:\s*[^;]/gi,
    /data:\s*text\/html/gi,
    /<img[\s\S]*?onerror\s*=\s*["'][^"']*javascript:/gi,
    /alert\s*\(\s*["'][^"']*["']\s*\)/gi,
    /confirm\s*\(\s*["'][^"']*["']\s*\)/gi,
    /prompt\s*\(\s*["'][^"']*["']\s*\)/gi,
    /document\.cookie\s*=/gi,
    /document\.write\s*\(/gi,
    /eval\s*\(\s*["'][^"']*["']\s*\)/gi,
    /setTimeout\s*\(\s*["'][^"']*javascript:/gi,
    /setInterval\s*\(\s*["'][^"']*javascript:/gi
  ]

  // SQL injection patterns - more specific to avoid matching normal query params
  private static SQL_PATTERNS = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b\s+\b(FROM|INTO|TABLE|WHERE|VALUES)\b)/gi,
    /(\b(OR|AND)\s+\d+\s*=\s*\d+\s*--)/gi,
    /('|(\\')|(;)|(--)|(\s)|(\/\*)|(\*\/))/gi,
    /(\b(WAITFOR|DELAY)\b\s+\b(DELAY|TIME)\b)/gi,
    /(\b(CAST|CONVERT|SUBSTRING|ASCII|CHAR)\b\s*\()/gi
  ]

  // Hacking tool user agents and signatures
  private static BLOCKED_TOOLS = [
    'burpsuite',
    'burp',
    'sqlmap',
    'nmap',
    'nikto',
    'metasploit',
    'msfconsole',
    'owasp',
    'zap',
    'w3af',
    'skipfish',
    'arachni',
    'acunetix',
    'appscan',
    'webinspect'
  ]

  // Legitimate browser patterns
  private static LEGITIMATE_BROWSERS = [
    /Mozilla\/5\.0\s*\([^)]*\)\s*AppleWebKit\/[^ ]*\s*\([^)]*\)\s*Chrome\/[^ ]*\s*Safari\/[^ ]*/,
    /Mozilla\/5\.0\s*\([^)]*\)\s*AppleWebKit\/[^ ]*\s*\([^)]*\)\s*Version\/[^ ]*\s*Mobile\/[^ ]*\s*Safari\/[^ ]*/,
    /Mozilla\/5\.0\s*\([^)]*\)\s*Gecko\/[^ ]*\s*Firefox\/[^ ]*/,
    /Mozilla\/5\.0\s*\([^)]*\)\s*AppleWebKit\/[^ ]*\s*\([^)]*\)\s*Edg\/[^ ]*/,
    /Mozilla\/5\.0\s*\([^)]*\)\s*AppleWebKit\/[^ ]*\s*\([^)]*\)\s*OPR\/[^ ]*/,
    /Mozilla\/5\.0\s*\([^)]*\)\s*Trident\/[^ ]*\s*rv:[^ ]*\)\s*like Gecko/
  ]

  // Suspicious headers that indicate automated tools
  private static SUSPICIOUS_HEADERS = [
    'x-forwarded-for',
    'x-originating-ip',
    'x-remote-ip',
    'x-cluster-client-ip'
  ]

  static detectXSS(input: string): boolean {
    if (!input || typeof input !== 'string') return false
    
    return this.XSS_PATTERNS.some(pattern => pattern.test(input))
  }

  static detectSQLInjection(input: string): boolean {
    if (!input || typeof input !== 'string') return false
    
    return this.SQL_PATTERNS.some(pattern => pattern.test(input))
  }

  static detectHackingTool(userAgent: string, headers: Record<string, string>): boolean {
    if (!userAgent) return false

    const ua = userAgent.toLowerCase()

    // Check for blocked tools first, regardless of browser type
    if (this.BLOCKED_TOOLS.some(tool => ua.includes(tool))) {
      return true
    }

    // First, check if it's a legitimate browser user agent
    const isLegitimateBrowser = this.LEGITIMATE_BROWSERS.some(pattern => pattern.test(userAgent))
    if (isLegitimateBrowser) {
      // For legitimate browsers, check for suspicious headers
      const hasSuspiciousHeaders = this.SUSPICIOUS_HEADERS.some(header =>
        headers[header.toLowerCase()] !== undefined
      )
      if (hasSuspiciousHeaders) {
        return true
      }
      return false
    }

    // For non-browser user agents (like curl, wget, etc.), only block if they have suspicious headers
    // This allows legitimate tools while blocking automated attacks
    const hasSuspiciousHeaders = this.SUSPICIOUS_HEADERS.some(header =>
      headers[header.toLowerCase()] !== undefined
    )
    if (hasSuspiciousHeaders) {
      return true
    }

    return false
  }

  static isMaliciousInput(input: string): boolean {
    return this.detectXSS(input) || this.detectSQLInjection(input)
  }

  static sanitizeAndValidate(input: string): { isValid: boolean; sanitized: string; threat: string } {
    if (!input || typeof input !== 'string') {
      return { isValid: true, sanitized: '', threat: '' }
    }

    let threat = ''
    
    if (this.detectXSS(input)) {
      threat = 'XSS_ATTEMPT'
    } else if (this.detectSQLInjection(input)) {
      threat = 'SQL_INJECTION_ATTEMPT'
    }

    if (threat) {
      return { 
        isValid: false, 
        sanitized: '', 
        threat 
      }
    }

    // Basic sanitization for safe inputs
    const sanitized = input
      .replace(/[<>]/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '')
      .trim()
      .substring(0, 1000) // Limit length

    return { 
      isValid: true, 
      sanitized, 
      threat: '' 
    }
  }
}