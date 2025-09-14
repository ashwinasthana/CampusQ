// Advanced security detection and blocking
export class SecurityDetector {
  // XSS patterns to detect and block
  private static XSS_PATTERNS = [
    /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe[\s\S]*?>/gi,
    /<object[\s\S]*?>/gi,
    /<embed[\s\S]*?>/gi,
    /<link[\s\S]*?>/gi,
    /<meta[\s\S]*?>/gi,
    /expression\s*\(/gi,
    /vbscript:/gi,
    /data:text\/html/gi,
    /<img[\s\S]*?onerror[\s\S]*?>/gi,
    /alert\s*\(/gi,
    /confirm\s*\(/gi,
    /prompt\s*\(/gi,
    /document\.cookie/gi,
    /document\.write/gi,
    /eval\s*\(/gi,
    /setTimeout\s*\(/gi,
    /setInterval\s*\(/gi
  ]

  // SQL injection patterns
  private static SQL_PATTERNS = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/gi,
    /(\b(OR|AND)\s+\d+\s*=\s*\d+)/gi,
    /('|(\\')|(;)|(--)|(\s)|(\/\*)|(\*\/))/gi,
    /(\b(WAITFOR|DELAY)\b)/gi,
    /(\b(CAST|CONVERT|SUBSTRING|ASCII|CHAR)\b)/gi
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
    
    // Only check for serious hacking tools
    if (this.BLOCKED_TOOLS.some(tool => ua.includes(tool))) {
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