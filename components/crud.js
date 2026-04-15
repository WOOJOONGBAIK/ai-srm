// CRUD 공통 함수들
export class CRUDManager {
  constructor(tableName, supabase) {
    this.tableName = tableName;
    this.supabase = supabase;
  }

  async create(data) {
    try {
      const { data: result, error } = await this.supabase
        .from(this.tableName)
        .insert(data)
        .select();

      if (error) throw error;
      return { success: true, data: result[0] };
    } catch (error) {
      console.error('Create error:', error);
      return { success: false, error: error.message };
    }
  }

  async read(filters = {}, options = {}) {
    try {
      let query = this.supabase.from(this.tableName).select('*');

      // 필터 적용
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          query = query.eq(key, value);
        }
      });

      // 정렬
      if (options.orderBy) {
        query = query.order(options.orderBy, { ascending: options.ascending !== false });
      }

      // 페이징
      if (options.limit) {
        query = query.limit(options.limit);
        if (options.offset) {
          query = query.range(options.offset, options.offset + options.limit - 1);
        }
      }

      const { data, error } = await query;

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Read error:', error);
      return { success: false, error: error.message };
    }
  }

  async update(id, data) {
    try {
      const { data: result, error } = await this.supabase
        .from(this.tableName)
        .update(data)
        .eq('id', id)
        .select();

      if (error) throw error;
      return { success: true, data: result[0] };
    } catch (error) {
      console.error('Update error:', error);
      return { success: false, error: error.message };
    }
  }

  async delete(id) {
    try {
      const { error } = await this.supabase
        .from(this.tableName)
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Delete error:', error);
      return { success: false, error: error.message };
    }
  }

  async search(searchTerm, searchFields = []) {
    try {
      let query = this.supabase.from(this.tableName).select('*');

      if (searchTerm && searchFields.length > 0) {
        const conditions = searchFields.map(field =>
          `${field}.ilike.%${searchTerm}%`
        );
        query = query.or(conditions.join(','));
      }

      const { data, error } = await query;

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Search error:', error);
      return { success: false, error: error.message };
    }
  }
}

// 폼 데이터 검증 유틸리티
export class FormValidator {
  static rules = {
    required: (value) => value !== null && value !== undefined && String(value).trim() !== '',
    email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    minLength: (value, min) => String(value).length >= min,
    maxLength: (value, max) => String(value).length <= max,
    numeric: (value) => !isNaN(value) && !isNaN(parseFloat(value)),
    url: (value) => /^https?:\/\/.+/.test(value)
  };

  static validate(data, rules) {
    const errors = {};

    Object.entries(rules).forEach(([field, fieldRules]) => {
      const value = data[field];

      fieldRules.forEach(rule => {
        let isValid = true;
        let message = '';

        if (typeof rule === 'string') {
          // 미리 정의된 룰
          if (this.rules[rule]) {
            isValid = this.rules[rule](value);
            message = this.getMessage(rule, field);
          }
        } else if (typeof rule === 'object') {
          // 커스텀 룰
          const { type, param, message: customMessage } = rule;
          if (this.rules[type]) {
            isValid = this.rules[type](value, param);
            message = customMessage || this.getMessage(type, field, param);
          }
        }

        if (!isValid) {
          if (!errors[field]) errors[field] = [];
          errors[field].push(message);
        }
      });
    });

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  static getMessage(rule, field, param) {
    const messages = {
      required: `${field}은(는) 필수 입력 항목입니다.`,
      email: `올바른 이메일 형식이 아닙니다.`,
      minLength: `${field}은(는) 최소 ${param}자 이상이어야 합니다.`,
      maxLength: `${field}은(는) 최대 ${param}자까지 입력 가능합니다.`,
      numeric: `${field}은(는) 숫자만 입력 가능합니다.`,
      url: `올바른 URL 형식이 아닙니다.`
    };
    return messages[rule] || `${field} 형식이 올바르지 않습니다.`;
  }
}

// 파일 업로드 유틸리티
export class FileUploader {
  constructor(supabase, bucket = 'files') {
    this.supabase = supabase;
    this.bucket = bucket;
  }

  async upload(file, path = null) {
    try {
      const fileName = path || `${Date.now()}-${file.name}`;
      const { data, error } = await this.supabase.storage
        .from(this.bucket)
        .upload(fileName, file);

      if (error) throw error;

      // 공개 URL 가져오기
      const { data: urlData } = this.supabase.storage
        .from(this.bucket)
        .getPublicUrl(fileName);

      return {
        success: true,
        data: {
          path: data.path,
          url: urlData.publicUrl,
          name: file.name,
          size: file.size,
          type: file.type
        }
      };
    } catch (error) {
      console.error('Upload error:', error);
      return { success: false, error: error.message };
    }
  }

  async delete(path) {
    try {
      const { error } = await this.supabase.storage
        .from(this.bucket)
        .remove([path]);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Delete error:', error);
      return { success: false, error: error.message };
    }
  }
}